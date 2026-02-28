import { describe, expect, it } from "vitest";
import type {
  NutritionLog,
  SyncQueueItem,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";
import { ProcessSyncQueueUseCase } from "./process-sync-queue";

class InMemoryTrainingPlanRepository implements TrainingPlanRepository {
  records: TrainingPlan[] = [];

  async save(plan: TrainingPlan): Promise<void> {
    this.records.push(plan);
  }

  async listByUserId(userId: string): Promise<TrainingPlan[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryWorkoutSessionRepository implements WorkoutSessionRepository {
  records: WorkoutSessionInput[] = [];

  async save(session: WorkoutSessionInput): Promise<void> {
    this.records.push(session);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryNutritionLogRepository implements NutritionLogRepository {
  records: NutritionLog[] = [];

  async save(log: NutritionLog): Promise<void> {
    this.records.push(log);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("ProcessSyncQueueUseCase", () => {
  it("processes valid queued items and rejects foreign user items", async () => {
    const trainingPlanRepository = new InMemoryTrainingPlanRepository();
    const workoutSessionRepository = new InMemoryWorkoutSessionRepository();
    const nutritionLogRepository = new InMemoryNutritionLogRepository();
    const useCase = new ProcessSyncQueueUseCase(
      trainingPlanRepository,
      workoutSessionRepository,
      nutritionLogRepository
    );

    const result = await useCase.execute("user-1", [
      {
        id: "queue-1",
        userId: "user-1",
        enqueuedAt: "2026-02-27T10:00:00.000Z",
        action: {
          type: "create_training_plan",
          payload: {
            id: "plan-1",
            userId: "user-1",
            name: "Starter Plan",
            weeks: 4,
            days: [
              {
                dayIndex: 1,
                exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 8 }]
              }
            ]
          }
        }
      },
      {
        id: "queue-2",
        userId: "user-1",
        enqueuedAt: "2026-02-27T10:01:00.000Z",
        action: {
          type: "create_workout_session",
          payload: {
            userId: "user-1",
            planId: "plan-1",
            startedAt: "2026-02-27T08:00:00.000Z",
            endedAt: "2026-02-27T08:30:00.000Z",
            exercises: [
              {
                exerciseId: "squat",
                sets: [{ reps: 8, loadKg: 60, rpe: 8 }]
              }
            ]
          }
        }
      },
      {
        id: "queue-3",
        userId: "user-2",
        enqueuedAt: "2026-02-27T10:02:00.000Z",
        action: {
          type: "create_nutrition_log",
          payload: {
            userId: "user-2",
            date: "2026-02-27",
            calories: 2100,
            proteinGrams: 145,
            carbsGrams: 230,
            fatsGrams: 65
          }
        }
      }
    ] satisfies SyncQueueItem[]);

    expect(result.acceptedIds).toEqual(["queue-1", "queue-2"]);
    expect(result.rejected).toEqual([{ id: "queue-3", reason: "invalid_user" }]);
    expect(trainingPlanRepository.records).toHaveLength(1);
    expect(workoutSessionRepository.records).toHaveLength(1);
    expect(nutritionLogRepository.records).toHaveLength(0);
  });

  it("throws when user id is empty", async () => {
    const useCase = new ProcessSyncQueueUseCase(
      new InMemoryTrainingPlanRepository(),
      new InMemoryWorkoutSessionRepository(),
      new InMemoryNutritionLogRepository()
    );

    await expect(useCase.execute("", [])).rejects.toThrowError("missing_user_id");
  });
});
