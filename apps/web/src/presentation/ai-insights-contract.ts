import type { DashboardHomeStatus } from "./dashboard-home-contract";

type RecommendationsStatus = "idle" | "loading" | "loaded" | "empty" | "error";

type CreateAIInsightsScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  recommendationsStatus: RecommendationsStatus;
  recommendationsCount: number;
};

export type AIInsightsScreenModel = {
  routeId: "web.route.aiInsights";
  screenId: "web.aiInsights.screen";
  status: DashboardHomeStatus;
  actions: {
    loadRecommendations: "web.aiInsights.loadRecommendations";
    refreshSignals: "web.aiInsights.refreshSignals";
  };
};

export function createAIInsightsScreenModel(
  input: CreateAIInsightsScreenModelInput
): AIInsightsScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return {
      routeId: "web.route.aiInsights",
      screenId: "web.aiInsights.screen",
      status: input.dashboardHomeStatus,
      actions: {
        loadRecommendations: "web.aiInsights.loadRecommendations",
        refreshSignals: "web.aiInsights.refreshSignals"
      }
    };
  }

  if (input.recommendationsStatus === "loading") {
    return {
      routeId: "web.route.aiInsights",
      screenId: "web.aiInsights.screen",
      status: "loading",
      actions: {
        loadRecommendations: "web.aiInsights.loadRecommendations",
        refreshSignals: "web.aiInsights.refreshSignals"
      }
    };
  }

  if (input.recommendationsStatus === "error") {
    return {
      routeId: "web.route.aiInsights",
      screenId: "web.aiInsights.screen",
      status: "error",
      actions: {
        loadRecommendations: "web.aiInsights.loadRecommendations",
        refreshSignals: "web.aiInsights.refreshSignals"
      }
    };
  }

  if (input.recommendationsStatus === "empty" || input.recommendationsCount === 0) {
    return {
      routeId: "web.route.aiInsights",
      screenId: "web.aiInsights.screen",
      status: "empty",
      actions: {
        loadRecommendations: "web.aiInsights.loadRecommendations",
        refreshSignals: "web.aiInsights.refreshSignals"
      }
    };
  }

  return {
    routeId: "web.route.aiInsights",
    screenId: "web.aiInsights.screen",
    status: "success",
    actions: {
      loadRecommendations: "web.aiInsights.loadRecommendations",
      refreshSignals: "web.aiInsights.refreshSignals"
    }
  };
}
