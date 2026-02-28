import { describe, expect, it } from "vitest";
import type { NutritionGateway } from "./manage-nutrition";
import { ManageNutritionUseCase } from "./manage-nutrition";

class InMemoryNutritionGateway implements NutritionGateway {
  private readonly logs = [
    {
      userId: "user-1",
      date: "2026-02-26",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    }
  ];

  async createNutritionLog(log: (typeof this.logs)[number]) {
    this.logs.push(log);
    return log;
  }

  async listNutritionLogs(userId: string) {
    return this.logs.filter((log) => log.userId === userId);
  }
}

describe("ManageNutritionUseCase", () => {
  it("lists logs for user", async () => {
    const useCase = new ManageNutritionUseCase(new InMemoryNutritionGateway());

    const logs = await useCase.listNutritionLogs("user-1");

    expect(logs).toHaveLength(1);
  });
});

