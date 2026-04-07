/**
 * React hook for ClinicalLogic integration.
 * Provides clinical evaluation data for dashboard components.
 */

import { useQuery } from "@tanstack/react-query";
import type { OrganType, LabResult } from "@/types/patient";
import {
  evaluatePatientClinical,
  getTacrolimusTarget,
  type ClinicalEvaluation,
} from "@/services/ClinicalLogic";

interface UseClinicalLogicParams {
  organType: OrganType;
  lab: Partial<LabResult> | null | undefined;
  patient: {
    id: string;
    transplant_date?: string | null;
    transplant_number?: number | null;
    dialysis_history?: boolean | null;
    blood_type?: string | null;
    donor_blood_type?: string | null;
    titer_therapy?: boolean | null;
  } | null;
  enabled?: boolean;
}

export function useClinicalLogic({ organType, lab, patient, enabled = true }: UseClinicalLogicParams) {
  const query = useQuery<ClinicalEvaluation | null>({
    queryKey: ["clinical-logic", patient?.id, lab?.tacrolimus_level, lab?.creatinine, lab?.alt],
    queryFn: async () => {
      if (!lab || !patient) return null;
      return evaluatePatientClinical(organType, lab, patient);
    },
    enabled: enabled && !!lab && !!patient,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const tacrolimusTarget = patient?.transplant_date
    ? getTacrolimusTarget(organType, patient.transplant_date)
    : null;

  return {
    evaluation: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    tacrolimusTarget,
    /** Quick access: is the patient at high risk? */
    isHighRisk: query.data?.riskLevel === "high",
    /** Quick access: critical warnings count */
    criticalCount: query.data?.warnings.filter((w) => w.severity === "critical").length ?? 0,
    /** Quick access: parameters with abnormal values */
    abnormalParams: query.data?.parameters.filter((p) => p.status !== "normal" && p.status !== "missing") ?? [],
  };
}
