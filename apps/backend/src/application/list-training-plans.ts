import type { TrainingPlan } from "@flux/contracts";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";

export class ListTrainingPlansUseCase {
  constructor(private readonly repository: TrainingPlanRepository) {}

  async execute(userId: string): Promise<TrainingPlan[]> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }
    return this.repository.listByUserId(userId);
  }
}

