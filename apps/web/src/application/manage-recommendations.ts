import { aiRecommendationSchema, type AIRecommendation, type Goal } from "@flux/contracts";

export type RecommendationsContext = {
  goal: Goal;
  pendingQueueCount: number;
  daysSinceLastWorkout: number;
  recentCompletionRate: number;
};

export type RecommendationsRequest = {
  userId: string;
  locale: string;
} & RecommendationsContext;

export interface RecommendationsGateway {
  listRecommendations(input: RecommendationsRequest): Promise<AIRecommendation[]>;
}

export class ManageRecommendationsUseCase {
  constructor(private readonly gateway: RecommendationsGateway) {}

  async listRecommendations(
    userId: string,
    locale: string,
    context: Partial<RecommendationsContext> = {}
  ): Promise<AIRecommendation[]> {
    const input: RecommendationsRequest = {
      userId,
      locale,
      goal: context.goal ?? "recomposition",
      pendingQueueCount: context.pendingQueueCount ?? 0,
      daysSinceLastWorkout: context.daysSinceLastWorkout ?? 0,
      recentCompletionRate: context.recentCompletionRate ?? 1
    };

    const recommendations = await this.gateway.listRecommendations(input);
    return aiRecommendationSchema.array().parse(recommendations);
  }
}
