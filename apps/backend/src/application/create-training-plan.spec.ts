import { describe, expect, it } from "vitest";
import type { TrainingPlan } from "@flux/contracts";
import { CreateTrainingPlanUseCase } from "./create-training-plan";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";

class InMemoryTrainingPlanRepository implements TrainingPlanRepository {
  records: TrainingPlan[] = [];

  async save(plan: TrainingPlan): Promise<void> {
    this.records.push(plan);
  }

  async listByUserId(userId: string): Promise<TrainingPlan[]> {
    return this.records.filter((plan) => plan.userId === userId);
  }
}

describe("CreateTrainingPlanUseCase", () => {
  it("stores a valid plan", async () => {
    const repository = new InMemoryTrainingPlanRepository();
    const useCase = new CreateTrainingPlanUseCase(repository);

    const plan = await useCase.execute({
      id: "plan-1",
      userId: "user-1",
      name: "Starter Plan",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [{ exerciseId: "goblet-squat", targetSets: 4, targetReps: 10 }]
        }
      ]
    });

    expect(plan.id).toBe("plan-1");
    expect(repository.records).toHaveLength(1);
  });
});
