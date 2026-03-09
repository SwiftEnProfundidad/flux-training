import type { DashboardHomeStatus } from "./dashboard-home-contract";

type ObservabilityStatus =
  | "idle"
  | "loading"
  | "event_saved"
  | "crash_saved"
  | "loaded"
  | "error";

type CreateAlertCenterScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  observabilityStatus: ObservabilityStatus;
  openAlertsCount: number;
};

export type AlertCenterScreenModel = {
  routeId: "web.route.dashboardHome";
  screenId: "web.alertCenter.screen";
  status: DashboardHomeStatus;
};

export function createAlertCenterScreenModel(
  input: CreateAlertCenterScreenModelInput
): AlertCenterScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied"
  ) {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.alertCenter.screen",
      status: input.dashboardHomeStatus
    };
  }
  if (input.dashboardHomeStatus === "error") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.alertCenter.screen",
      status: "error"
    };
  }
  if (input.observabilityStatus === "loading") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.alertCenter.screen",
      status: "loading"
    };
  }
  if (input.observabilityStatus === "error") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.alertCenter.screen",
      status: "error"
    };
  }
  if (input.openAlertsCount === 0) {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.alertCenter.screen",
      status: "empty"
    };
  }
  return {
    routeId: "web.route.dashboardHome",
    screenId: "web.alertCenter.screen",
    status: "success"
  };
}
