import { trainingPlanSchema, type TrainingPlan } from "@flux/contracts";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";

export class CreateTrainingPlanUseCase {
  constructor(private readonly repository: TrainingPlanRepository) {}

  async execute(payload: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan> {
    const plan = trainingPlanSchema.parse({
      ...payload,
      createdAt: new Date().toISOString()
    });
    await this.repository.save(plan);
    return plan;
  }
}

