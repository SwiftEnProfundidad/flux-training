import type { AIRecommendation } from "@flux/contracts";
import type { RecommendationsGateway, RecommendationsRequest } from "../application/manage-recommendations";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiRecommendationsGateway implements RecommendationsGateway {
  async listRecommendations(input: RecommendationsRequest): Promise<AIRecommendation[]> {
    const query = new URLSearchParams({
      userId: input.userId,
      locale: input.locale,
      goal: input.goal,
      pendingQueueCount: String(input.pendingQueueCount),
      daysSinceLastWorkout: String(input.daysSinceLastWorkout),
      recentCompletionRate: String(input.recentCompletionRate)
    });
    const response = await fetch(`/api/listAIRecommendations?${query.toString()}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_ai_recommendations_failed");
    const payload = (await response.json()) as { recommendations: AIRecommendation[] };
    return payload.recommendations;
  }
}

export const apiRecommendationsGateway: RecommendationsGateway =
  new ApiRecommendationsGateway();
