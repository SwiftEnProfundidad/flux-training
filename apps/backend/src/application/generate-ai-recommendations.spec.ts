import { describe, expect, it } from "vitest";
import { GenerateAIRecommendationsUseCase } from "./generate-ai-recommendations";

describe("GenerateAIRecommendationsUseCase", () => {
  it("returns prioritized recommendations for retention", async () => {
    const useCase = new GenerateAIRecommendationsUseCase(() => "2026-03-01T10:00:00.000Z");

    const recommendations = await useCase.execute({
      userId: "user-1",
      goal: "fat_loss",
      pendingQueueCount: 2,
      daysSinceLastWorkout: 3,
      recentCompletionRate: 0.45,
      locale: "es-ES"
    });

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]?.priority).toBe("high");
    expect(recommendations.some((item) => item.category === "sync")).toBe(true);
  });
});
