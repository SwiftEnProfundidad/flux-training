import {
  syncQueueProcessResultSchema,
  type SyncQueueItem,
  type SyncQueueProcessResult
} from "@flux/contracts";
import { CreateNutritionLogUseCase } from "./create-nutrition-log";
import { CreateTrainingPlanUseCase } from "./create-training-plan";
import { CreateWorkoutSessionUseCase } from "./create-workout-session";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

export class ProcessSyncQueueUseCase {
  private readonly createTrainingPlanUseCase: CreateTrainingPlanUseCase;
  private readonly createWorkoutSessionUseCase: CreateWorkoutSessionUseCase;
  private readonly createNutritionLogUseCase: CreateNutritionLogUseCase;

  constructor(
    trainingPlanRepository: TrainingPlanRepository,
    workoutSessionRepository: WorkoutSessionRepository,
    nutritionLogRepository: NutritionLogRepository
  ) {
    this.createTrainingPlanUseCase = new CreateTrainingPlanUseCase(trainingPlanRepository);
    this.createWorkoutSessionUseCase = new CreateWorkoutSessionUseCase(workoutSessionRepository);
    this.createNutritionLogUseCase = new CreateNutritionLogUseCase(nutritionLogRepository);
  }

  async execute(userId: string, items: SyncQueueItem[]): Promise<SyncQueueProcessResult> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }

    const acceptedIds: string[] = [];
    const rejected: SyncQueueProcessResult["rejected"] = [];

    for (const item of items) {
      if (item.userId !== userId) {
        rejected.push({ id: item.id, reason: "invalid_user" });
        continue;
      }

      if (item.action.payload.userId !== userId) {
        rejected.push({ id: item.id, reason: "invalid_payload_user" });
        continue;
      }

      try {
        if (item.action.type === "create_training_plan") {
          await this.createTrainingPlanUseCase.execute(item.action.payload);
        }
        if (item.action.type === "create_workout_session") {
          await this.createWorkoutSessionUseCase.execute(item.action.payload);
        }
        if (item.action.type === "create_nutrition_log") {
          await this.createNutritionLogUseCase.execute(item.action.payload);
        }
        acceptedIds.push(item.id);
      } catch {
        rejected.push({ id: item.id, reason: "processing_failed" });
      }
    }

    return syncQueueProcessResultSchema.parse({ acceptedIds, rejected });
  }
}
