import type { DashboardHomeStatus } from "./dashboard-home-contract";

type ObservabilityStatus =
  | "idle"
  | "loading"
  | "event_saved"
  | "crash_saved"
  | "loaded"
  | "error";

type CreateRecentActivityScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  observabilityStatus: ObservabilityStatus;
  activityEntriesCount: number;
};

export type RecentActivityScreenModel = {
  routeId: "web.route.recentActivity";
  screenId: "web.recentActivity.screen";
  status: DashboardHomeStatus;
};

export function createRecentActivityScreenModel(
  input: CreateRecentActivityScreenModelInput
): RecentActivityScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied"
  ) {
    return {
      routeId: "web.route.recentActivity",
      screenId: "web.recentActivity.screen",
      status: input.dashboardHomeStatus
    };
  }
  if (input.dashboardHomeStatus === "error") {
    return {
      routeId: "web.route.recentActivity",
      screenId: "web.recentActivity.screen",
      status: "error"
    };
  }
  if (input.observabilityStatus === "loading") {
    return {
      routeId: "web.route.recentActivity",
      screenId: "web.recentActivity.screen",
      status: "loading"
    };
  }
  if (input.observabilityStatus === "error") {
    return {
      routeId: "web.route.recentActivity",
      screenId: "web.recentActivity.screen",
      status: "error"
    };
  }
  if (input.activityEntriesCount === 0) {
    return {
      routeId: "web.route.recentActivity",
      screenId: "web.recentActivity.screen",
      status: "empty"
    };
  }
  return {
    routeId: "web.route.recentActivity",
    screenId: "web.recentActivity.screen",
    status: "success"
  };
}
