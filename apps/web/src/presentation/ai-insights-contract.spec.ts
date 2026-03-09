import { describe, expect, it } from "vitest";
import { createAIInsightsScreenModel } from "./ai-insights-contract";

describe("ai insights contract", () => {
  it("inherits loading/offline/denied/error from dashboard home", () => {
    expect(
      createAIInsightsScreenModel({
        dashboardHomeStatus: "loading",
        recommendationsStatus: "loaded",
        recommendationsCount: 2
      }).status
    ).toBe("loading");

    expect(
      createAIInsightsScreenModel({
        dashboardHomeStatus: "offline",
        recommendationsStatus: "loaded",
        recommendationsCount: 2
      }).status
    ).toBe("offline");

    expect(
      createAIInsightsScreenModel({
        dashboardHomeStatus: "denied",
        recommendationsStatus: "loaded",
        recommendationsCount: 2
      }).status
    ).toBe("denied");
  });

  it("maps recommendations loading and error", () => {
    expect(
      createAIInsightsScreenModel({
        dashboardHomeStatus: "success",
        recommendationsStatus: "loading",
        recommendationsCount: 0
      }).status
    ).toBe("loading");

    expect(
      createAIInsightsScreenModel({
        dashboardHomeStatus: "success",
        recommendationsStatus: "error",
        recommendationsCount: 0
      }).status
    ).toBe("error");
  });

  it("returns empty when recommendations are missing", () => {
    expect(
      createAIInsightsScreenModel({
        dashboardHomeStatus: "success",
        recommendationsStatus: "loaded",
        recommendationsCount: 0
      }).status
    ).toBe("empty");
  });

  it("returns canonical route, screen and actions", () => {
    expect(
      createAIInsightsScreenModel({
        dashboardHomeStatus: "success",
        recommendationsStatus: "loaded",
        recommendationsCount: 3
      })
    ).toEqual({
      routeId: "web.route.aiInsights",
      screenId: "web.aiInsights.screen",
      status: "success",
      actions: {
        loadRecommendations: "web.aiInsights.loadRecommendations",
        refreshSignals: "web.aiInsights.refreshSignals"
      }
    });
  });
});
