import { describe, expect, it } from "vitest";
import type { NutritionLog } from "@flux/contracts";
import { ListNutritionLogsUseCase } from "./list-nutrition-logs";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";

class InMemoryNutritionLogRepository implements NutritionLogRepository {
  constructor(private readonly records: NutritionLog[]) {}

  async save(log: NutritionLog): Promise<void> {
    this.records.push(log);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("ListNutritionLogsUseCase", () => {
  it("returns nutrition logs for user", async () => {
    const repository = new InMemoryNutritionLogRepository([
      {
        userId: "user-1",
        date: "2026-02-26",
        calories: 2200,
        proteinGrams: 150,
        carbsGrams: 230,
        fatsGrams: 70
      }
    ]);
    const useCase = new ListNutritionLogsUseCase(repository);

    const logs = await useCase.execute("user-1");

    expect(logs).toHaveLength(1);
    expect(logs[0]?.date).toBe("2026-02-26");
  });
});

