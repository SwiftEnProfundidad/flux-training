import type {
  NutritionLog,
  ProgressSummary,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";

export type AthleteRiskLevel = "normal" | "attention";
export type AthleteSortMode = "athlete" | "sessions" | "lastSession";

export type AthleteOperationsRow = {
  athleteId: string;
  plansCount: number;
  sessionsCount: number;
  nutritionLogsCount: number;
  lastSessionDate: string;
  riskLevel: AthleteRiskLevel;
};

export function buildAthleteOperationsRows(
  plans: TrainingPlan[],
  sessions: WorkoutSessionInput[],
  nutritionLogs: NutritionLog[],
  progressSummary: ProgressSummary | null
): AthleteOperationsRow[] {
  const athleteIds = new Set<string>();

  for (const plan of plans) {
    athleteIds.add(plan.userId);
  }
  for (const session of sessions) {
    athleteIds.add(session.userId);
  }
  for (const log of nutritionLogs) {
    athleteIds.add(log.userId);
  }
  if (progressSummary !== null) {
    athleteIds.add(progressSummary.userId);
  }

  return Array.from(athleteIds).map((athleteId) => {
    const athletePlans = plans.filter((plan) => plan.userId === athleteId);
    const athleteSessions = sessions.filter((session) => session.userId === athleteId);
    const athleteNutritionLogs = nutritionLogs.filter((log) => log.userId === athleteId);
    const lastSession = athleteSessions
      .map((session) => session.endedAt)
      .sort((left, right) => right.localeCompare(left))[0];

    const riskLevel: AthleteRiskLevel =
      athleteSessions.length === 0 || athleteNutritionLogs.length === 0
        ? "attention"
        : "normal";

    return {
      athleteId,
      plansCount: athletePlans.length,
      sessionsCount: athleteSessions.length,
      nutritionLogsCount: athleteNutritionLogs.length,
      lastSessionDate: lastSession?.slice(0, 10) ?? "-",
      riskLevel
    };
  });
}

export function filterAthleteOperationsRows(
  rows: AthleteOperationsRow[],
  query: string
): AthleteOperationsRow[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return rows;
  }
  return rows.filter((row) => row.athleteId.toLowerCase().includes(normalizedQuery));
}

export function sortAthleteOperationsRows(
  rows: AthleteOperationsRow[],
  sortMode: AthleteSortMode
): AthleteOperationsRow[] {
  return [...rows].sort((left, right) => {
    if (sortMode === "athlete") {
      return left.athleteId.localeCompare(right.athleteId);
    }
    if (sortMode === "sessions") {
      if (right.sessionsCount !== left.sessionsCount) {
        return right.sessionsCount - left.sessionsCount;
      }
      return left.athleteId.localeCompare(right.athleteId);
    }
    if (right.lastSessionDate !== left.lastSessionDate) {
      return right.lastSessionDate.localeCompare(left.lastSessionDate);
    }
    return left.athleteId.localeCompare(right.athleteId);
  });
}
