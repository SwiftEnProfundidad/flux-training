import type { DashboardHomeStatus } from "./dashboard-home-contract";

type CreateReadinessMonitorScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  readinessScore: number;
  authStatus: string;
};

export type ReadinessMonitorScreenModel = {
  routeId: "web.route.readinessMonitor";
  screenId: "web.readinessMonitor.screen";
  status: DashboardHomeStatus;
};

export function createReadinessMonitorScreenModel(
  input: CreateReadinessMonitorScreenModelInput
): ReadinessMonitorScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return {
      routeId: "web.route.readinessMonitor",
      screenId: "web.readinessMonitor.screen",
      status: input.dashboardHomeStatus
    };
  }
  if (input.authStatus === "loading") {
    return {
      routeId: "web.route.readinessMonitor",
      screenId: "web.readinessMonitor.screen",
      status: "loading"
    };
  }
  if (input.readinessScore <= 0) {
    return {
      routeId: "web.route.readinessMonitor",
      screenId: "web.readinessMonitor.screen",
      status: "empty"
    };
  }
  return {
    routeId: "web.route.readinessMonitor",
    screenId: "web.readinessMonitor.screen",
    status: "success"
  };
}
