/**
 * ClinicalLogic — Unified clinical evaluation module.
 *
 * Bridges the gap between:
 *   - clinical_thresholds (DB) → dynamic norms
 *   - risk.ts (hardcoded) → deterministic scoring
 *   - riskSnapshotService → explainable risk with flags
 *
 * Provides high-level clinical evaluation functions for dashboard consumption.
 */

import type { OrganType } from "@/types/patient";
import type { LabResult } from "@/types/patient";
import {
  fetchClinicalThresholds,
  evaluateValue,
  type ClinicalThreshold,
} from "@/services/clinicalThresholdService";
import {
  kidneyTacrolimusScore,
  liverTacrolimusScore,
  missingTacrolimusScore,
} from "@/utils/risk";

// ─── Types ───

export interface ClinicalEvaluation {
  /** Overall risk score 0-100 */
  riskScore: number;
  /** Risk level: low / medium / high */
  riskLevel: "low" | "medium" | "high";
  /** Individual parameter evaluations */
  parameters: ParameterEvaluation[];
  /** Tacrolimus-specific evaluation */
  tacrolimus: TacrolimusEvaluation;
  /** Clinical warnings & suggestions */
  warnings: ClinicalWarning[];
  /** Algorithm version */
  algorithmVersion: string;
}

export interface ParameterEvaluation {
  parameter: string;
  value: number | null;
  unit: string;
  status: "normal" | "warning" | "critical" | "missing";
  normalRange: string;
  guideline: string;
  points: number;
  message: string;
}

export interface TacrolimusEvaluation {
  value: number | null;
  status: "normal" | "low" | "high" | "missing";
  targetRange: string;
  daysSinceTx: number | null;
  transplantStage: string;
  guideline: string;
  points: number;
}

export interface ClinicalWarning {
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  guideline?: string;
}

// ─── Constants ───

const ALGORITHM_VERSION = "v4.1-clinical-logic";

// ─── Helpers ───

function daysSinceDate(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return d >= 0 ? d : null;
}

function getTransplantStage(daysSinceTx: number | null, organ: OrganType): string {
  if (daysSinceTx === null) return "unknown";
  if (organ === "kidney") {
    if (daysSinceTx <= 90) return "early (0-3 mo)";
    if (daysSinceTx <= 365) return "intermediate (3-12 mo)";
    return "maintenance (>12 mo)";
  }
  // liver
  if (daysSinceTx <= 30) return "early (0-1 mo)";
  if (daysSinceTx <= 180) return "intermediate (1-6 mo)";
  return "maintenance (>6 mo)";
}

// ─── Main Evaluation ───

/**
 * Evaluate a patient's clinical status using dynamic DB thresholds.
 * Falls back gracefully if DB is unavailable.
 */
export async function evaluatePatientClinical(
  organType: OrganType,
  lab: Partial<LabResult>,
  patient: {
    transplant_date?: string | null;
    transplant_number?: number | null;
    dialysis_history?: boolean | null;
    blood_type?: string | null;
    donor_blood_type?: string | null;
    titer_therapy?: boolean | null;
  }
): Promise<ClinicalEvaluation> {
  // Fetch thresholds from DB
  let thresholds: ClinicalThreshold[] = [];
  try {
    const all = await fetchClinicalThresholds();
    thresholds = all.filter((t) => t.organ_type === organType);
  } catch (e) {
    console.warn("ClinicalLogic: DB thresholds unavailable, using limited evaluation:", e);
  }

  const daysSinceTx = daysSinceDate(patient.transplant_date);
  const stage = getTransplantStage(daysSinceTx, organType);
  const parameters: ParameterEvaluation[] = [];
  const warnings: ClinicalWarning[] = [];
  let totalPoints = 0;

  // ── Evaluate each DB threshold parameter ──
  const labMap: Record<string, number | null | undefined> = {
    creatinine: lab.creatinine,
    egfr: lab.egfr,
    potassium: lab.potassium,
    proteinuria: lab.proteinuria,
    alt: lab.alt,
    ast: lab.ast,
    total_bilirubin: lab.total_bilirubin,
    direct_bilirubin: lab.direct_bilirubin,
    hb: lab.hb,
    albumin: lab.albumin,
    platelets: lab.platelets,
    inr: lab.inr,
    alp: lab.alp,
    ggt: lab.ggt,
    crp: lab.crp,
    tacrolimus: lab.tacrolimus_level,
  };

  for (const threshold of thresholds) {
    if (threshold.parameter === "tacrolimus") continue; // handled separately
    const value = labMap[threshold.parameter] ?? null;
    const normalRange = `${threshold.normal_min ?? "—"}–${threshold.normal_max ?? "—"} ${threshold.unit}`;

    if (value == null) {
      parameters.push({
        parameter: threshold.parameter,
        value: null,
        unit: threshold.unit,
        status: "missing",
        normalRange,
        guideline: `${threshold.guideline_source} ${threshold.guideline_year}`,
        points: 0,
        message: `${threshold.parameter} data not available`,
      });
      continue;
    }

    const result = evaluateValue(value, threshold);
    totalPoints += result.points;
    parameters.push({
      parameter: threshold.parameter,
      value,
      unit: threshold.unit,
      status: result.status,
      normalRange,
      guideline: result.guideline,
      points: result.points,
      message: result.message,
    });

    if (result.status === "critical") {
      warnings.push({
        severity: "critical",
        title: `${threshold.parameter.toUpperCase()} critically abnormal`,
        message: result.message,
        guideline: result.guideline,
      });
    }
  }

  // ── Tacrolimus evaluation (time-dependent) ──
  const tacValue = lab.tacrolimus_level ?? 0;
  let tacEval: TacrolimusEvaluation;

  if (tacValue > 0) {
    const tacResult = organType === "liver"
      ? liverTacrolimusScore(tacValue, daysSinceTx)
      : kidneyTacrolimusScore(tacValue, daysSinceTx);

    totalPoints += tacResult.pts;
    tacEval = {
      value: tacValue,
      status: tacResult.pts > 0
        ? (tacValue < parseFloat(tacResult.target.split("-")[0]) ? "low" : "high")
        : "normal",
      targetRange: tacResult.target,
      daysSinceTx,
      transplantStage: stage,
      guideline: tacResult.guideline,
      points: tacResult.pts,
    };

    if (tacResult.pts > 0) {
      warnings.push({
        severity: "critical",
        title: `Tacrolimus outside target`,
        message: `Tacrolimus ${tacValue} ng/mL is outside the target range [${tacResult.target}] for ${stage}`,
        guideline: tacResult.guideline,
      });
    }
  } else {
    const missing = missingTacrolimusScore(0, organType);
    totalPoints += missing.pts;
    const targetRange = organType === "kidney"
      ? (daysSinceTx !== null && daysSinceTx <= 90 ? "8-12" : daysSinceTx !== null && daysSinceTx <= 365 ? "6-8" : "4-6")
      : (daysSinceTx !== null && daysSinceTx <= 30 ? "8-10" : daysSinceTx !== null && daysSinceTx <= 180 ? "6-8" : "4-7");

    tacEval = {
      value: null,
      status: "missing",
      targetRange,
      daysSinceTx,
      transplantStage: stage,
      guideline: organType === "kidney" ? "KDIGO 2009/2024" : "AASLD 2021/2023",
      points: missing.pts,
    };

    warnings.push({
      severity: "warning",
      title: "Tacrolimus data missing",
      message: missing.message,
      guideline: tacEval.guideline,
    });
  }

  // ── Additional risk factors ──
  if (daysSinceTx !== null && daysSinceTx < 90) {
    totalPoints += 10;
    warnings.push({ severity: "warning", title: "Early post-transplant", message: `${daysSinceTx} days since transplant — higher baseline risk` });
  }

  if ((patient.transplant_number ?? 1) >= 2) {
    totalPoints += 15;
    warnings.push({ severity: "warning", title: "Re-transplant", message: "Re-transplant patient — elevated rejection risk" });
  }

  if (organType === "kidney" && patient.dialysis_history) {
    totalPoints += 20;
    warnings.push({ severity: "warning", title: "Dialysis history", message: "Previous dialysis increases baseline risk", guideline: "KDIGO 2024" });
  }

  if (patient.blood_type && patient.donor_blood_type && patient.blood_type !== patient.donor_blood_type) {
    const titerDone = patient.titer_therapy === true;
    totalPoints += titerDone ? 10 : 25;
    warnings.push({
      severity: titerDone ? "warning" : "critical",
      title: "Blood type mismatch",
      message: `Patient ${patient.blood_type} / Donor ${patient.donor_blood_type}${titerDone ? " (titer therapy done)" : ""}`,
    });
  }

  // ── High risk clinical suggestion ──
  const finalScore = Math.min(totalPoints, 100);
  const riskLevel = finalScore >= 60 ? "high" : finalScore >= 30 ? "medium" : "low";

  if (riskLevel === "high") {
    warnings.push({
      severity: "critical",
      title: "Potential rejection or toxicity",
      message: `Warning: Risk score ${finalScore}/100. Consult ${organType === "kidney" ? "KDIGO" : "AASLD"} protocols immediately.`,
      guideline: organType === "kidney" ? "KDIGO 2024" : "AASLD 2023",
    });
  }

  return {
    riskScore: finalScore,
    riskLevel,
    parameters,
    tacrolimus: tacEval,
    warnings,
    algorithmVersion: ALGORITHM_VERSION,
  };
}

/**
 * Get the expected Tacrolimus target range for a given organ and transplant date.
 * Useful for UI display without a full evaluation.
 */
export function getTacrolimusTarget(
  organType: OrganType,
  transplantDate: string | null | undefined
): { target: string; stage: string; guideline: string } {
  const daysSinceTx = daysSinceDate(transplantDate);
  const stage = getTransplantStage(daysSinceTx, organType);
  const guideline = organType === "kidney" ? "KDIGO 2009/2024" : "AASLD 2021/2023";

  if (organType === "kidney") {
    const d = daysSinceTx ?? 999;
    const target = d <= 90 ? "8-12" : d <= 365 ? "6-8" : "4-6";
    return { target, stage, guideline };
  }
  // liver
  const d = daysSinceTx ?? 999;
  const target = d <= 30 ? "8-10" : d <= 180 ? "6-8" : "4-7";
  return { target, stage, guideline };
}
