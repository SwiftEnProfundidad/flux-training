import { describe, expect, it } from "vitest";
import type { NutritionLog, ProgressSummary } from "@flux/contracts";
import {
  buildProgressHistoryRows,
  filterNutritionLogs,
  filterProgressHistoryRows,
  sortNutritionLogs,
  sortProgressHistoryRows
} from "./nutrition-progress-operations";

const nutritionLogs: NutritionLog[] = [
  {
    userId: "athlete-a",
    date: "2026-03-02",
    calories: 2200,
    proteinGrams: 150,
    carbsGrams: 230,
    fatsGrams: 70
  },
  {
    userId: "athlete-a",
    date: "2026-03-01",
    calories: 2500,
    proteinGrams: 170,
    carbsGrams: 280,
    fatsGrams: 80
  },
  {
    userId: "athlete-a",
    date: "2026-02-28",
    calories: 1900,
    proteinGrams: 120,
    carbsGrams: 200,
    fatsGrams: 60
  }
];

const progressSummary: ProgressSummary = {
  userId: "athlete-a",
  generatedAt: "2026-03-02T10:00:00.000Z",
  workoutSessionsCount: 4,
  totalTrainingMinutes: 220,
  totalCompletedSets: 24,
  nutritionLogsCount: 3,
  averageCalories: 2200,
  averageProteinGrams: 147,
  averageCarbsGrams: 237,
  averageFatsGrams: 70,
  history: [
    {
      date: "2026-03-02",
      workoutSessions: 2,
      trainingMinutes: 90,
      completedSets: 10,
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    },
    {
      date: "2026-03-01",
      workoutSessions: 1,
      trainingMinutes: 65,
      completedSets: 7,
      calories: 2500,
      proteinGrams: 170,
      carbsGrams: 280,
      fatsGrams: 80
    },
    {
      date: "2026-02-28",
      workoutSessions: 1,
      trainingMinutes: 60,
      completedSets: 7,
      calories: 1900,
      proteinGrams: 120,
      carbsGrams: 200,
      fatsGrams: 60
    }
  ]
};

describe("nutrition and progress operations", () => {
  it("filters nutrition logs by date, minimum protein and maximum calories", () => {
    const filtered = filterNutritionLogs(nutritionLogs, {
      queryDate: "2026-03",
      minProteinGrams: 140,
      maxCalories: 2300
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.date).toBe("2026-03-02");
  });

  it("sorts nutrition logs by calories, protein and date", () => {
    expect(sortNutritionLogs(nutritionLogs, "calories_desc")[0]?.calories).toBe(2500);
    expect(sortNutritionLogs(nutritionLogs, "protein_desc")[0]?.proteinGrams).toBe(170);
    expect(sortNutritionLogs(nutritionLogs, "date_desc")[0]?.date).toBe("2026-03-02");
  });

  it("builds progress rows with effort score and filters/sorts history", () => {
    const rows = buildProgressHistoryRows(progressSummary);
    expect(rows[0]?.effortScore).toBe(130);

    const filtered = filterProgressHistoryRows(rows, 2);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.date).toBe("2026-03-02");

    const sortedByMinutes = sortProgressHistoryRows(rows, "minutes_desc");
    expect(sortedByMinutes[0]?.trainingMinutes).toBe(90);
    const sortedBySessions = sortProgressHistoryRows(rows, "sessions_desc");
    expect(sortedBySessions[0]?.workoutSessions).toBe(2);
  });
});
