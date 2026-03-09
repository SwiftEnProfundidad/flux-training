import type { DashboardHomeStatus } from "./dashboard-home-contract";

type ObservabilityStatus =
  | "idle"
  | "loading"
  | "event_saved"
  | "crash_saved"
  | "loaded"
  | "error";

type CreateAlertsFullScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  observabilityStatus: ObservabilityStatus;
  openAlertsCount: number;
  runbooksCount: number;
};

export type AlertsFullScreenModel = {
  routeId: "web.route.alertsFull";
  screenId: "web.alertsFull.screen";
  status: DashboardHomeStatus;
};

export function createAlertsFullScreenModel(
  input: CreateAlertsFullScreenModelInput
): AlertsFullScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied"
  ) {
    return {
      routeId: "web.route.alertsFull",
      screenId: "web.alertsFull.screen",
      status: input.dashboardHomeStatus
    };
  }
  if (input.dashboardHomeStatus === "error") {
    return {
      routeId: "web.route.alertsFull",
      screenId: "web.alertsFull.screen",
      status: "error"
    };
  }
  if (input.observabilityStatus === "loading") {
    return {
      routeId: "web.route.alertsFull",
      screenId: "web.alertsFull.screen",
      status: "loading"
    };
  }
  if (input.observabilityStatus === "error") {
    return {
      routeId: "web.route.alertsFull",
      screenId: "web.alertsFull.screen",
      status: "error"
    };
  }
  if (input.openAlertsCount === 0 && input.runbooksCount === 0) {
    return {
      routeId: "web.route.alertsFull",
      screenId: "web.alertsFull.screen",
      status: "empty"
    };
  }
  return {
    routeId: "web.route.alertsFull",
    screenId: "web.alertsFull.screen",
    status: "success"
  };
}
