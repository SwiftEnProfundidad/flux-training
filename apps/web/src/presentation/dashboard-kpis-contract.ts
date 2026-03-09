import type { DashboardHomeStatus } from "./dashboard-home-contract";

type CreateDashboardKpisScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  plansCount: number;
  sessionsCount: number;
  nutritionLogsCount: number;
  recommendationsCount: number;
  openAlertsCount: number;
  pendingQueueCount: number;
};

export type DashboardKpisScreenModel = {
  routeId: "web.route.dashboardKpis";
  screenId: "web.dashboardKpis.screen";
  status: DashboardHomeStatus;
};

export function createDashboardKpisScreenModel(
  input: CreateDashboardKpisScreenModelInput
): DashboardKpisScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return {
      routeId: "web.route.dashboardKpis",
      screenId: "web.dashboardKpis.screen",
      status: input.dashboardHomeStatus
    };
  }
  const totalCoverage =
    input.plansCount +
    input.sessionsCount +
    input.nutritionLogsCount +
    input.recommendationsCount +
    input.openAlertsCount +
    input.pendingQueueCount;
  if (totalCoverage === 0) {
    return {
      routeId: "web.route.dashboardKpis",
      screenId: "web.dashboardKpis.screen",
      status: "empty"
    };
  }
  return {
    routeId: "web.route.dashboardKpis",
    screenId: "web.dashboardKpis.screen",
    status: "success"
  };
}
