import { describe, expect, it } from "vitest";
import type { NutritionLog, TrainingPlan, WorkoutSessionInput } from "@flux/contracts";
import { ListBillingInvoicesUseCase } from "./list-billing-invoices";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

class InMemoryTrainingPlanRepository implements TrainingPlanRepository {
  constructor(private readonly records: TrainingPlan[]) {}

  async save(plan: TrainingPlan): Promise<void> {
    this.records.push(plan);
  }

  async listByUserId(userId: string): Promise<TrainingPlan[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryWorkoutSessionRepository implements WorkoutSessionRepository {
  constructor(private readonly records: WorkoutSessionInput[]) {}

  async save(session: WorkoutSessionInput): Promise<void> {
    this.records.push(session);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryNutritionLogRepository implements NutritionLogRepository {
  constructor(private readonly records: NutritionLog[]) {}

  async save(log: NutritionLog): Promise<void> {
    this.records.push(log);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("ListBillingInvoicesUseCase", () => {
  it("returns deterministic invoices for a user", async () => {
    const useCase = new ListBillingInvoicesUseCase(
      new InMemoryTrainingPlanRepository([
        {
          id: "plan-1",
          userId: "user-1",
          name: "Starter",
          weeks: 4,
          days: [{ dayIndex: 1, exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 8 }] }],
          createdAt: "2026-03-01T10:00:00.000Z"
        }
      ]),
      new InMemoryWorkoutSessionRepository([
        {
          userId: "user-1",
          planId: "plan-1",
          startedAt: "2026-03-02T08:00:00.000Z",
          endedAt: "2026-03-02T08:45:00.000Z",
          exercises: [{ exerciseId: "squat", sets: [{ reps: 8, loadKg: 60, rpe: 8 }] }]
        }
      ]),
      new InMemoryNutritionLogRepository([
        {
          userId: "user-1",
          date: "2026-03-02",
          calories: 2200,
          proteinGrams: 150,
          carbsGrams: 230,
          fatsGrams: 70
        }
      ]),
      () => "2026-03-02T12:00:00.000Z"
    );

    const invoices = await useCase.execute("user-1");

    expect(invoices).toHaveLength(4);
    expect(invoices[0]?.period).toBe("2026-03");
    expect(invoices[0]?.issuedAt).toBe("2026-03-02T12:00:00.000Z");
    expect(invoices.map((invoice) => invoice.status)).toEqual([
      "open",
      "paid",
      "overdue",
      "draft"
    ]);
  });

  it("throws on missing user id", async () => {
    const useCase = new ListBillingInvoicesUseCase(
      new InMemoryTrainingPlanRepository([]),
      new InMemoryWorkoutSessionRepository([]),
      new InMemoryNutritionLogRepository([])
    );

    await expect(useCase.execute("")).rejects.toThrowError("missing_user_id");
  });
});
