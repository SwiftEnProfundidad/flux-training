import { describe, expect, it } from "vitest";
import type {
  NutritionLog,
  ProgressSummary,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";
import {
  buildAthleteOperationsRows,
  filterAthleteOperationsRows,
  sortAthleteOperationsRows
} from "./core-operations";

const plans: TrainingPlan[] = [
  {
    id: "plan-1",
    userId: "athlete-a",
    name: "Strength Base",
    weeks: 4,
    days: [{ dayIndex: 1, exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 6 }] }],
    createdAt: "2026-03-02T10:00:00.000Z"
  },
  {
    id: "plan-2",
    userId: "athlete-b",
    name: "Hypertrophy Block",
    weeks: 5,
    days: [{ dayIndex: 2, exercises: [{ exerciseId: "bench", targetSets: 4, targetReps: 8 }] }],
    createdAt: "2026-03-02T10:00:00.000Z"
  }
];

const sessions: WorkoutSessionInput[] = [
  {
    userId: "athlete-a",
    planId: "plan-1",
    startedAt: "2026-03-01T09:00:00.000Z",
    endedAt: "2026-03-01T09:55:00.000Z",
    exercises: [{ exerciseId: "squat", sets: [{ reps: 6, loadKg: 90, rpe: 8 }] }]
  },
  {
    userId: "athlete-a",
    planId: "plan-1",
    startedAt: "2026-03-02T09:00:00.000Z",
    endedAt: "2026-03-02T09:42:00.000Z",
    exercises: [{ exerciseId: "bench", sets: [{ reps: 8, loadKg: 70, rpe: 8 }] }]
  }
];

const nutritionLogs: NutritionLog[] = [
  {
    userId: "athlete-a",
    date: "2026-03-02",
    calories: 2200,
    proteinGrams: 150,
    carbsGrams: 230,
    fatsGrams: 70
  }
];

const progressSummary: ProgressSummary = {
  userId: "athlete-a",
  generatedAt: "2026-03-02T10:00:00.000Z",
  workoutSessionsCount: 2,
  totalTrainingMinutes: 97,
  totalCompletedSets: 2,
  nutritionLogsCount: 1,
  averageCalories: 2200,
  averageProteinGrams: 150,
  averageCarbsGrams: 230,
  averageFatsGrams: 70,
  history: [
    {
      date: "2026-03-02",
      workoutSessions: 2,
      trainingMinutes: 97,
      completedSets: 2,
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    }
  ]
};

describe("core operations", () => {
  it("builds athlete rows aggregating plans, sessions and nutrition coverage", () => {
    const rows = buildAthleteOperationsRows(plans, sessions, nutritionLogs, progressSummary);

    expect(rows).toHaveLength(2);
    const athleteA = rows.find((row) => row.athleteId === "athlete-a");
    const athleteB = rows.find((row) => row.athleteId === "athlete-b");

    expect(athleteA).toMatchObject({
      plansCount: 1,
      sessionsCount: 2,
      nutritionLogsCount: 1,
      lastSessionDate: "2026-03-02",
      riskLevel: "normal"
    });
    expect(athleteB).toMatchObject({
      plansCount: 1,
      sessionsCount: 0,
      nutritionLogsCount: 0,
      lastSessionDate: "-",
      riskLevel: "attention"
    });
  });

  it("filters rows by athlete id", () => {
    const rows = buildAthleteOperationsRows(plans, sessions, nutritionLogs, progressSummary);
    expect(filterAthleteOperationsRows(rows, "athlete-a")).toHaveLength(1);
    expect(filterAthleteOperationsRows(rows, "missing")).toHaveLength(0);
  });

  it("sorts rows by sessions, athlete id and last session date", () => {
    const rows = buildAthleteOperationsRows(plans, sessions, nutritionLogs, progressSummary);

    const bySessions = sortAthleteOperationsRows(rows, "sessions");
    expect(bySessions.map((row) => row.athleteId)).toEqual(["athlete-a", "athlete-b"]);

    const byAthlete = sortAthleteOperationsRows(rows, "athlete");
    expect(byAthlete.map((row) => row.athleteId)).toEqual(["athlete-a", "athlete-b"]);

    const byLastSession = sortAthleteOperationsRows(rows, "lastSession");
    expect(byLastSession.map((row) => row.athleteId)).toEqual(["athlete-a", "athlete-b"]);
  });
});
