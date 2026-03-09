import { describe, expect, it } from "vitest";
import type { NutritionLog, TrainingPlan, WorkoutSessionInput } from "@flux/contracts";
import { GetProgressSummaryUseCase } from "./get-progress-summary";
import { ProcessSyncQueueUseCase } from "./process-sync-queue";
import { RequestAuthRecoveryUseCase } from "./request-auth-recovery";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

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

describe("RecoveryPathE2ESuite", () => {
  it("recovers from rejected queue items and converges to consistent progress", async () => {
    const trainingPlanRepository = new InMemoryTrainingPlanRepository();
    const workoutSessionRepository = new InMemoryWorkoutSessionRepository();
    const nutritionLogRepository = new InMemoryNutritionLogRepository();
    const processSyncQueueUseCase = new ProcessSyncQueueUseCase(
      trainingPlanRepository,
      workoutSessionRepository,
      nutritionLogRepository
    );
    const getProgressSummaryUseCase = new GetProgressSummaryUseCase(
      workoutSessionRepository,
      nutritionLogRepository
    );
    const requestAuthRecoveryUseCase = new RequestAuthRecoveryUseCase(
      () => "2026-03-02T19:30:00.000Z"
    );

    const recovery = await requestAuthRecoveryUseCase.execute({
      channel: "sms",
      identifier: "+34123456789"
    });

    const firstSync = await processSyncQueueUseCase.execute("user-recovery-1", [
      {
        id: "queue-rejected",
        userId: "user-recovery-1",
        enqueuedAt: "2026-03-02T19:31:00.000Z",
        action: {
          type: "create_nutrition_log",
          payload: {
            userId: "other-user",
            date: "2026-03-02",
            calories: 2150,
            proteinGrams: 145,
            carbsGrams: 220,
            fatsGrams: 68
          }
        }
      },
      {
        id: "queue-accepted-plan",
        userId: "user-recovery-1",
        enqueuedAt: "2026-03-02T19:32:00.000Z",
        action: {
          type: "create_training_plan",
          payload: {
            id: "plan-recovery-1",
            userId: "user-recovery-1",
            name: "Recovery Plan",
            weeks: 4,
            days: [
              {
                dayIndex: 1,
                exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 8 }]
              }
            ]
          }
        }
      }
    ]);

    const secondSync = await processSyncQueueUseCase.execute("user-recovery-1", [
      {
        id: "queue-recovered",
        userId: "user-recovery-1",
        enqueuedAt: "2026-03-02T19:33:00.000Z",
        action: {
          type: "create_nutrition_log",
          payload: {
            userId: "user-recovery-1",
            date: "2026-03-02",
            calories: 2150,
            proteinGrams: 145,
            carbsGrams: 220,
            fatsGrams: 68
          }
        }
      },
      {
        id: "queue-workout",
        userId: "user-recovery-1",
        enqueuedAt: "2026-03-02T19:34:00.000Z",
        action: {
          type: "create_workout_session",
          payload: {
            userId: "user-recovery-1",
            planId: "plan-recovery-1",
            startedAt: "2026-03-02T07:00:00.000Z",
            endedAt: "2026-03-02T07:35:00.000Z",
            exercises: [
              {
                exerciseId: "squat",
                sets: [{ reps: 8, loadKg: 60, rpe: 8 }]
              }
            ]
          }
        }
      }
    ]);

    const progress = await getProgressSummaryUseCase.execute(
      "user-recovery-1",
      "2026-03-02T19:35:00.000Z"
    );

    expect(recovery.status).toBe("recovery_sent_sms");
    expect(firstSync.acceptedIds).toEqual(["queue-accepted-plan"]);
    expect(firstSync.rejected).toEqual([
      { id: "queue-rejected", reason: "invalid_payload_user" }
    ]);
    expect(secondSync.acceptedIds).toEqual(["queue-recovered", "queue-workout"]);
    expect(secondSync.rejected).toEqual([]);
    expect(progress.workoutSessionsCount).toBe(1);
    expect(progress.nutritionLogsCount).toBe(1);
    expect(trainingPlanRepository.records).toHaveLength(1);
  });
});
