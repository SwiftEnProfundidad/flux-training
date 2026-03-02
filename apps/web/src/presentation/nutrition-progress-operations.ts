import type { NutritionLog, ProgressSummary } from "@flux/contracts";

export type NutritionSortMode = "date_desc" | "calories_desc" | "protein_desc";
export type ProgressSortMode = "date_desc" | "sessions_desc" | "minutes_desc";

export type ProgressHistoryRow = ProgressSummary["history"][number] & {
  effortScore: number;
};

export type NutritionFilterInput = {
  queryDate: string;
  minProteinGrams: number | null;
  maxCalories: number | null;
};

export function filterNutritionLogs(
  logs: NutritionLog[],
  filters: NutritionFilterInput
): NutritionLog[] {
  const queryDate = filters.queryDate.trim();
  return logs.filter((log) => {
    const matchesDate = queryDate.length === 0 || log.date.includes(queryDate);
    const matchesProtein =
      filters.minProteinGrams === null || log.proteinGrams >= filters.minProteinGrams;
    const matchesCalories =
      filters.maxCalories === null || log.calories <= filters.maxCalories;
    return matchesDate && matchesProtein && matchesCalories;
  });
}

export function sortNutritionLogs(
  logs: NutritionLog[],
  mode: NutritionSortMode
): NutritionLog[] {
  return [...logs].sort((left, right) => {
    if (mode === "calories_desc") {
      if (right.calories !== left.calories) {
        return right.calories - left.calories;
      }
      return right.date.localeCompare(left.date);
    }
    if (mode === "protein_desc") {
      if (right.proteinGrams !== left.proteinGrams) {
        return right.proteinGrams - left.proteinGrams;
      }
      return right.date.localeCompare(left.date);
    }
    return right.date.localeCompare(left.date);
  });
}

export function buildProgressHistoryRows(
  summary: ProgressSummary | null
): ProgressHistoryRow[] {
  if (summary === null) {
    return [];
  }
  return summary.history.map((entry) => ({
    ...entry,
    effortScore: entry.trainingMinutes + entry.completedSets * 4
  }));
}

export function filterProgressHistoryRows(
  rows: ProgressHistoryRow[],
  minSessions: number | null
): ProgressHistoryRow[] {
  if (minSessions === null) {
    return rows;
  }
  return rows.filter((row) => row.workoutSessions >= minSessions);
}

export function sortProgressHistoryRows(
  rows: ProgressHistoryRow[],
  mode: ProgressSortMode
): ProgressHistoryRow[] {
  return [...rows].sort((left, right) => {
    if (mode === "sessions_desc") {
      if (right.workoutSessions !== left.workoutSessions) {
        return right.workoutSessions - left.workoutSessions;
      }
      return right.date.localeCompare(left.date);
    }
    if (mode === "minutes_desc") {
      if (right.trainingMinutes !== left.trainingMinutes) {
        return right.trainingMinutes - left.trainingMinutes;
      }
      return right.date.localeCompare(left.date);
    }
    return right.date.localeCompare(left.date);
  });
}
