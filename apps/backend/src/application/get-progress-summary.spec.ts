import { describe, expect, it } from "vitest";
import type { NutritionLog, ProgressSummary, WorkoutSessionInput } from "@flux/contracts";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";
import { GetProgressSummaryUseCase } from "./get-progress-summary";

class InMemoryWorkoutSessionRepository implements WorkoutSessionRepository {
  constructor(private readonly sessions: WorkoutSessionInput[]) {}

  async save(session: WorkoutSessionInput): Promise<void> {
    this.sessions.push(session);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    return this.sessions.filter((session) => session.userId === userId);
  }
}

class InMemoryNutritionLogRepository implements NutritionLogRepository {
  constructor(private readonly logs: NutritionLog[]) {}

  async save(log: NutritionLog): Promise<void> {
    this.logs.push(log);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    return this.logs.filter((log) => log.userId === userId);
  }
}

describe("GetProgressSummaryUseCase", () => {
  it("aggregates training and nutrition metrics", async () => {
    const workoutRepository = new InMemoryWorkoutSessionRepository([
      {
        userId: "user-1",
        planId: "plan-1",
        startedAt: "2026-02-25T08:00:00.000Z",
        endedAt: "2026-02-25T08:50:00.000Z",
        exercises: [{ exerciseId: "squat", sets: [{ reps: 8, loadKg: 60, rpe: 8 }, { reps: 8, loadKg: 62.5, rpe: 8 }] }]
      },
      {
        userId: "user-1",
        planId: "plan-1",
        startedAt: "2026-02-26T09:00:00.000Z",
        endedAt: "2026-02-26T09:45:00.000Z",
        exercises: [{ exerciseId: "bench", sets: [{ reps: 10, loadKg: 50, rpe: 7 }] }]
      }
    ]);
    const nutritionRepository = new InMemoryNutritionLogRepository([
      {
        userId: "user-1",
        date: "2026-02-25",
        calories: 2200,
        proteinGrams: 150,
        carbsGrams: 230,
        fatsGrams: 70
      },
      {
        userId: "user-1",
        date: "2026-02-26",
        calories: 2100,
        proteinGrams: 145,
        carbsGrams: 225,
        fatsGrams: 68
      }
    ]);
    const useCase = new GetProgressSummaryUseCase(workoutRepository, nutritionRepository);

    const summary = await useCase.execute("user-1", "2026-02-26T10:00:00.000Z");

    expect(summary).toEqual<ProgressSummary>({
      userId: "user-1",
      generatedAt: "2026-02-26T10:00:00.000Z",
      workoutSessionsCount: 2,
      totalTrainingMinutes: 95,
      totalCompletedSets: 3,
      nutritionLogsCount: 2,
      averageCalories: 2150,
      averageProteinGrams: 147.5,
      averageCarbsGrams: 227.5,
      averageFatsGrams: 69,
      history: [
        {
          date: "2026-02-25",
          workoutSessions: 1,
          trainingMinutes: 50,
          completedSets: 2,
          calories: 2200,
          proteinGrams: 150,
          carbsGrams: 230,
          fatsGrams: 70
        },
        {
          date: "2026-02-26",
          workoutSessions: 1,
          trainingMinutes: 45,
          completedSets: 1,
          calories: 2100,
          proteinGrams: 145,
          carbsGrams: 225,
          fatsGrams: 68
        }
      ]
    });
  });

  it("throws when user id is empty", async () => {
    const workoutRepository = new InMemoryWorkoutSessionRepository([]);
    const nutritionRepository = new InMemoryNutritionLogRepository([]);
    const useCase = new GetProgressSummaryUseCase(workoutRepository, nutritionRepository);

    await expect(useCase.execute("")).rejects.toThrowError("missing_user_id");
  });
});
