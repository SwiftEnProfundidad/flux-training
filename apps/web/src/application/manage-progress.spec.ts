import { describe, expect, it } from "vitest";
import type { ProgressGateway } from "./manage-progress";
import { ManageProgressUseCase } from "./manage-progress";

class InMemoryProgressGateway implements ProgressGateway {
  async getProgressSummary(userId: string) {
    return {
      userId,
      generatedAt: "2026-02-26T10:00:00.000Z",
      workoutSessionsCount: 2,
      totalTrainingMinutes: 95,
      totalCompletedSets: 3,
      nutritionLogsCount: 2,
      averageCalories: 2150,
      averageProteinGrams: 147.5,
      averageCarbsGrams: 227.5,
      averageFatsGrams: 69,
      history: [
        {
          date: "2026-02-25",
          workoutSessions: 1,
          trainingMinutes: 50,
          completedSets: 2,
          calories: 2200,
          proteinGrams: 150,
          carbsGrams: 230,
          fatsGrams: 70
        }
      ]
    };
  }
}

describe("ManageProgressUseCase", () => {
  it("returns user progress summary", async () => {
    const useCase = new ManageProgressUseCase(new InMemoryProgressGateway());

    const summary = await useCase.getSummary("user-1");

    expect(summary.userId).toBe("user-1");
    expect(summary.workoutSessionsCount).toBe(2);
    expect(summary.history).toHaveLength(1);
  });

  it("throws when user id is empty", async () => {
    const useCase = new ManageProgressUseCase(new InMemoryProgressGateway());

    await expect(useCase.getSummary("")).rejects.toThrowError("missing_user_id");
  });
});
