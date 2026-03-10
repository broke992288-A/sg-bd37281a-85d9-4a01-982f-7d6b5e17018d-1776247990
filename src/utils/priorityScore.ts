/**
 * Patient Priority Score Calculator
 * Calculates a 0–100 score to help doctors identify which patients need attention first.
 */

export interface PriorityInput {
  riskScore: number | null;        // 0–100 from patient record
  riskLevel: string;               // "low" | "medium" | "high"
  lastReviewDate: string | null;   // last_risk_evaluation timestamp
  latestLabDate: string | null;    // most recent lab recorded_at
  hasCriticalLab: boolean;         // any critical lab values
  organType: string;
  latestLab: {
    creatinine?: number | null;
    tacrolimus_level?: number | null;
    alt?: number | null;
    ast?: number | null;
    total_bilirubin?: number | null;
    egfr?: number | null;
    potassium?: number | null;
  } | null;
}

export interface PriorityResult {
  score: number;
  category: "critical" | "review" | "stable";
  reasons: string[];
}

export function calculatePriorityScore(input: PriorityInput): PriorityResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Current Risk Score (up to 40 points)
  const riskScore = input.riskScore ?? 0;
  if (riskScore > 80) {
    score += 40;
    reasons.push("Yuqori xavf darajasi (>80)");
  } else if (riskScore > 60) {
    score += 25;
    reasons.push("O'rtacha xavf darajasi");
  } else if (riskScore > 40) {
    score += 12;
  }

  // 2. Risk level as prediction proxy (up to 20 points)
  if (input.riskLevel === "high") {
    score += 20;
    if (!reasons.some(r => r.includes("xavf"))) {
      reasons.push("Yuqori xavf darajasi");
    }
  } else if (input.riskLevel === "medium") {
    score += 10;
  }

  // 3. New lab uploaded within 24h (up to 10 points)
  if (input.latestLabDate) {
    const hoursAgo = (Date.now() - new Date(input.latestLabDate).getTime()) / 3600000;
    if (hoursAgo <= 24) {
      score += 10;
      reasons.push("Yangi tahlil yuklandi (24 soat ichida)");
    } else if (hoursAgo <= 72) {
      score += 5;
    }
  }

  // 4. Days since last doctor review (up to 15 points)
  if (input.lastReviewDate) {
    const daysSinceReview = (Date.now() - new Date(input.lastReviewDate).getTime()) / 86400000;
    if (daysSinceReview > 14) {
      score += 15;
      reasons.push(`${Math.floor(daysSinceReview)} kun ko'rib chiqilmagan`);
    } else if (daysSinceReview > 10) {
      score += 10;
      reasons.push(`${Math.floor(daysSinceReview)} kun ko'rib chiqilmagan`);
    } else if (daysSinceReview > 7) {
      score += 5;
    }
  } else {
    // Never reviewed
    score += 15;
    reasons.push("Hech qachon ko'rib chiqilmagan");
  }

  // 5. Critical lab values (up to 15 points)
  if (input.latestLab) {
    const lab = input.latestLab;
    if (input.organType === "kidney") {
      if (lab.creatinine && lab.creatinine > 2.0) {
        score += 8;
        reasons.push(`Kreatinin yuqori: ${lab.creatinine}`);
      }
      if (lab.egfr && lab.egfr < 30) {
        score += 7;
        reasons.push(`eGFR past: ${lab.egfr}`);
      }
      if (lab.potassium && (lab.potassium > 5.5 || lab.potassium < 3.0)) {
        score += 7;
        reasons.push(`Kaliy og'ishi: ${lab.potassium}`);
      }
    } else if (input.organType === "liver") {
      if (lab.alt && lab.alt > 80) {
        score += 5;
        reasons.push(`ALT yuqori: ${lab.alt}`);
      }
      if (lab.ast && lab.ast > 80) {
        score += 5;
        reasons.push(`AST yuqori: ${lab.ast}`);
      }
      if (lab.tacrolimus_level && (lab.tacrolimus_level < 4 || lab.tacrolimus_level > 20)) {
        score += 7;
        reasons.push(`Tacrolimus og'ishi: ${lab.tacrolimus_level}`);
      }
      if (lab.total_bilirubin && lab.total_bilirubin > 2.0) {
        score += 5;
        reasons.push(`Bilirubin yuqori: ${lab.total_bilirubin}`);
      }
    }
  }

  // Clamp to 0–100
  score = Math.min(100, Math.max(0, score));

  const category: PriorityResult["category"] =
    score >= 80 ? "critical" :
    score >= 50 ? "review" :
    "stable";

  return { score, category, reasons };
}

export function priorityCategoryLabel(cat: "critical" | "review" | "stable") {
  switch (cat) {
    case "critical": return "Zudlik bilan e'tibor";
    case "review": return "Ko'rib chiqish kerak";
    case "stable": return "Barqaror";
  }
}

export function priorityCategoryColor(cat: "critical" | "review" | "stable") {
  switch (cat) {
    case "critical": return "bg-destructive text-destructive-foreground";
    case "review": return "bg-warning text-warning-foreground";
    case "stable": return "bg-success text-success-foreground";
  }
}
