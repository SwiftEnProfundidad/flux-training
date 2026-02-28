import { trainingPlanSchema, type TrainingPlan } from "@flux/contracts";

export function createTrainingPlanDraft(
  input: Omit<TrainingPlan, "createdAt">
): TrainingPlan {
  return trainingPlanSchema.parse({
    ...input,
    createdAt: new Date().toISOString()
  });
}

