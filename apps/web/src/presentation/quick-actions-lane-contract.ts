import type { WebLane } from "./access-gate-lane-contract";
import {
  createQuickActionsScreenModel,
  type QuickActionsScreenModel
} from "./quick-actions-contract";

type CreateQuickActionsLaneScreenModelInput = {
  lane: WebLane;
  dashboardHomeStatus: "loading" | "empty" | "error" | "success" | "denied" | "offline";
  trainingStatus:
    | "idle"
    | "loading"
    | "saved"
    | "loaded"
    | "queued"
    | "validation_error"
    | "error";
  nutritionStatus:
    | "idle"
    | "loading"
    | "saved"
    | "loaded"
    | "queued"
    | "validation_error"
    | "error"
    | "empty"
    | "offline"
    | "denied";
  progressStatus:
    | "idle"
    | "loading"
    | "saved"
    | "loaded"
    | "queued"
    | "validation_error"
    | "error"
    | "empty"
    | "offline"
    | "denied";
  recommendationsStatus: "idle" | "loading" | "loaded" | "empty" | "error";
  syncStatus: "idle" | "loading" | "synced" | "error";
};

export type QuickActionsLaneScreenModel = Omit<QuickActionsScreenModel, "screenId"> & {
  screenId: "web.quickActions.screen" | "web.light.quickActions.screen";
  actions: {
    runAll: "web.quickActions.runAll" | "web.light.quickActions.runAll";
    refreshDashboard:
      | "web.quickActions.refreshDashboard"
      | "web.light.quickActions.refreshDashboard";
    loadPlans: "web.quickActions.loadPlans" | "web.light.quickActions.loadPlans";
    loadSessions: "web.quickActions.loadSessions" | "web.light.quickActions.loadSessions";
    loadRecommendations:
      | "web.quickActions.loadRecommendations"
      | "web.light.quickActions.loadRecommendations";
  };
};

export function createQuickActionsLaneScreenModel(
  input: CreateQuickActionsLaneScreenModelInput
): QuickActionsLaneScreenModel {
  const baseModel = createQuickActionsScreenModel({
    dashboardHomeStatus: input.dashboardHomeStatus,
    trainingStatus: input.trainingStatus,
    nutritionStatus: input.nutritionStatus,
    progressStatus: input.progressStatus,
    recommendationsStatus: input.recommendationsStatus,
    syncStatus: input.syncStatus
  });
  if (input.lane === "secondary") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.light.quickActions.screen",
      status: baseModel.status,
      actions: {
        runAll: "web.light.quickActions.runAll",
        refreshDashboard: "web.light.quickActions.refreshDashboard",
        loadPlans: "web.light.quickActions.loadPlans",
        loadSessions: "web.light.quickActions.loadSessions",
        loadRecommendations: "web.light.quickActions.loadRecommendations"
      }
    };
  }
  return {
    routeId: "web.route.dashboardHome",
    screenId: "web.quickActions.screen",
    status: baseModel.status,
    actions: {
      runAll: "web.quickActions.runAll",
      refreshDashboard: "web.quickActions.refreshDashboard",
      loadPlans: "web.quickActions.loadPlans",
      loadSessions: "web.quickActions.loadSessions",
      loadRecommendations: "web.quickActions.loadRecommendations"
    }
  };
}
