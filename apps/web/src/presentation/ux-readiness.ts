export type ReleaseCompatibilityStatus = "compatible" | "upgrade_required";

export type UXReadinessSnapshot = {
  score: number;
  label: "ready_to_train" | "warming_up" | "needs_setup" | "upgrade_required";
  tone: "positive" | "warning" | "critical";
};

export type UXReadinessInput = {
  authStatus: string;
  onboardingStatus: string;
  trainingStatus: string;
  nutritionStatus: string;
  progressStatus: string;
  syncStatus: string;
  observabilityStatus: string;
  pendingQueueCount: number;
  releaseCompatibilityStatus: ReleaseCompatibilityStatus;
};

function hasAny(status: string, expectedValues: string[]): boolean {
  return expectedValues.some((value) => status.includes(value));
}

export function buildUXReadinessSnapshot(input: UXReadinessInput): UXReadinessSnapshot {
  let score = 0;

  if (input.authStatus.startsWith("signed_in")) {
    score += 20;
  }
  if (input.onboardingStatus === "saved") {
    score += 15;
  }
  if (hasAny(input.trainingStatus, ["saved", "loaded"])) {
    score += 15;
  }
  if (hasAny(input.nutritionStatus, ["saved", "loaded"])) {
    score += 10;
  }
  if (input.progressStatus === "loaded") {
    score += 10;
  }
  if (input.syncStatus === "synced") {
    score += 10;
  }
  if (hasAny(input.observabilityStatus, ["loaded", "event_saved", "crash_saved"])) {
    score += 10;
  }

  const queueScore = Math.max(0, 10 - input.pendingQueueCount * 4);
  score += queueScore;
  score = Math.max(0, Math.min(100, score));

  if (input.releaseCompatibilityStatus === "upgrade_required") {
    return {
      score: Math.min(score, 20),
      label: "upgrade_required",
      tone: "critical"
    };
  }

  if (score >= 85) {
    return {
      score,
      label: "ready_to_train",
      tone: "positive"
    };
  }

  if (score >= 55) {
    return {
      score,
      label: "warming_up",
      tone: "warning"
    };
  }

  return {
    score,
    label: "needs_setup",
    tone: "warning"
  };
}
