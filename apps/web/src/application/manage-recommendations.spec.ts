import { describe, expect, it } from "vitest";
import type { AIRecommendation } from "@flux/contracts";
import { ManageRecommendationsUseCase, type RecommendationsGateway } from "./manage-recommendations";

class InMemoryRecommendationsGateway implements RecommendationsGateway {
  async listRecommendations(input: {
    userId: string;
    locale: string;
  }): Promise<AIRecommendation[]> {
    return [
      {
        id: "rec-001",
        userId: input.userId,
        title: "Completa una sesion corta hoy",
        rationale: "Dos dias sin entrenar reducen adherencia semanal.",
        priority: "high",
        category: "training",
        expectedImpact: "retention",
        actionLabel: "Iniciar sesion de 20 min",
        generatedAt: "2026-03-01T10:00:00.000Z"
      },
      {
        id: "rec-002",
        userId: input.userId,
        title: "Sincroniza tu cola offline",
        rationale: "Tienes acciones pendientes de enviar al servidor.",
        priority: "medium",
        category: "sync",
        expectedImpact: "consistency",
        actionLabel: "Sincronizar ahora",
        generatedAt: "2026-03-01T10:00:00.000Z"
      }
    ];
  }
}

describe("ManageRecommendationsUseCase", () => {
  it("loads recommendations for user locale", async () => {
    const useCase = new ManageRecommendationsUseCase(new InMemoryRecommendationsGateway());

    const recommendations = await useCase.listRecommendations("user-1", "es-ES", {
      pendingQueueCount: 2,
      daysSinceLastWorkout: 3,
      recentCompletionRate: 0.45
    });

    expect(recommendations).toHaveLength(2);
    expect(recommendations[0]?.priority).toBe("high");
  });
});
