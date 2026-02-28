import type { TrainingPlan } from "@flux/contracts";

export interface TrainingPlanRepository {
  save(plan: TrainingPlan): Promise<void>;
  listByUserId(userId: string): Promise<TrainingPlan[]>;
}
