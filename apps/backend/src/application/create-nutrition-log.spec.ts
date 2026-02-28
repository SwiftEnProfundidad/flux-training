import { describe, expect, it } from "vitest";
import type { NutritionLog } from "@flux/contracts";
import { CreateNutritionLogUseCase } from "./create-nutrition-log";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";

class InMemoryNutritionLogRepository implements NutritionLogRepository {
  records: NutritionLog[] = [];

  async save(log: NutritionLog): Promise<void> {
    this.records.push(log);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("CreateNutritionLogUseCase", () => {
  it("stores nutrition log", async () => {
    const repository = new InMemoryNutritionLogRepository();
    const useCase = new CreateNutritionLogUseCase(repository);

    await useCase.execute({
      userId: "user-1",
      date: "2026-02-26",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    });

    expect(repository.records).toHaveLength(1);
  });
});

