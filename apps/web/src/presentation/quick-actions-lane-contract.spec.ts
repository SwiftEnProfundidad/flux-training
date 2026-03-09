import { describe, expect, it } from "vitest";
import { createQuickActionsLaneScreenModel } from "./quick-actions-lane-contract";

describe("quick actions lane contract", () => {
  it("returns main lane identifiers/actions", () => {
    expect(
      createQuickActionsLaneScreenModel({
        lane: "main",
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        nutritionStatus: "loaded",
        progressStatus: "loaded",
        recommendationsStatus: "loaded",
        syncStatus: "synced"
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.quickActions.screen",
      status: "success",
      actions: {
        runAll: "web.quickActions.runAll",
        refreshDashboard: "web.quickActions.refreshDashboard",
        loadPlans: "web.quickActions.loadPlans",
        loadSessions: "web.quickActions.loadSessions",
        loadRecommendations: "web.quickActions.loadRecommendations"
      }
    });
  });

  it("returns secondary lane identifiers/actions and keeps status resolver", () => {
    expect(
      createQuickActionsLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        trainingStatus: "idle",
        nutritionStatus: "empty",
        progressStatus: "idle",
        recommendationsStatus: "empty",
        syncStatus: "idle"
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.light.quickActions.screen",
      status: "empty",
      actions: {
        runAll: "web.light.quickActions.runAll",
        refreshDashboard: "web.light.quickActions.refreshDashboard",
        loadPlans: "web.light.quickActions.loadPlans",
        loadSessions: "web.light.quickActions.loadSessions",
        loadRecommendations: "web.light.quickActions.loadRecommendations"
      }
    });
  });
});
