import { describe, expect, it } from "vitest";
import type { TrainingPlan } from "@flux/contracts";
import { ListTrainingPlansUseCase } from "./list-training-plans";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";

class InMemoryTrainingPlanRepository implements TrainingPlanRepository {
  constructor(private readonly records: TrainingPlan[]) {}

  async save(plan: TrainingPlan): Promise<void> {
    this.records.push(plan);
  }

  async listByUserId(userId: string): Promise<TrainingPlan[]> {
    return this.records.filter((plan) => plan.userId === userId);
  }
}

describe("ListTrainingPlansUseCase", () => {
  it("returns plans for target user", async () => {
    const repository = new InMemoryTrainingPlanRepository([
      {
        id: "plan-1",
        userId: "user-1",
        name: "Starter",
        weeks: 4,
        days: [
          {
            dayIndex: 1,
            exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 10 }]
          }
        ],
        createdAt: "2026-02-25T00:00:00.000Z"
      },
      {
        id: "plan-2",
        userId: "user-2",
        name: "Other",
        weeks: 4,
        days: [
          {
            dayIndex: 2,
            exercises: [{ exerciseId: "bench", targetSets: 4, targetReps: 8 }]
          }
        ],
        createdAt: "2026-02-25T00:00:00.000Z"
      }
    ]);
    const useCase = new ListTrainingPlansUseCase(repository);

    const plans = await useCase.execute("user-1");

    expect(plans).toHaveLength(1);
    expect(plans[0]?.id).toBe("plan-1");
  });
});

