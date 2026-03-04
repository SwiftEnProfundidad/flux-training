import type { WebLane } from "./access-gate-lane-contract";
import {
  createDashboardKpisScreenModel,
  type DashboardKpisScreenModel
} from "./dashboard-kpis-contract";

type CreateDashboardKpisLaneScreenModelInput = {
  lane: WebLane;
  dashboardHomeStatus: "loading" | "empty" | "error" | "success" | "denied" | "offline";
  plansCount: number;
  sessionsCount: number;
  nutritionLogsCount: number;
  recommendationsCount: number;
  openAlertsCount: number;
  pendingQueueCount: number;
};

export type DashboardKpisLaneScreenModel = Omit<DashboardKpisScreenModel, "screenId" | "routeId"> & {
  routeId: "web.route.dashboardKpis" | "web.route.light.dashboardKpis";
  screenId: "web.dashboardKpis.screen" | "web.light.dashboardKpis.screen";
  actions: {
    refresh: "web.dashboardKpis.refresh" | "web.light.dashboardKpis.refresh";
  };
};

export function createDashboardKpisLaneScreenModel(
  input: CreateDashboardKpisLaneScreenModelInput
): DashboardKpisLaneScreenModel {
  const baseModel = createDashboardKpisScreenModel({
    dashboardHomeStatus: input.dashboardHomeStatus,
    plansCount: input.plansCount,
    sessionsCount: input.sessionsCount,
    nutritionLogsCount: input.nutritionLogsCount,
    recommendationsCount: input.recommendationsCount,
    openAlertsCount: input.openAlertsCount,
    pendingQueueCount: input.pendingQueueCount
  });

  if (input.lane === "secondary") {
    return {
      routeId: "web.route.light.dashboardKpis",
      screenId: "web.light.dashboardKpis.screen",
      status: baseModel.status,
      actions: {
        refresh: "web.light.dashboardKpis.refresh"
      }
    };
  }

  return {
    routeId: "web.route.dashboardKpis",
    screenId: "web.dashboardKpis.screen",
    status: baseModel.status,
    actions: {
      refresh: "web.dashboardKpis.refresh"
    }
  };
}
