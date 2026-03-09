import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateDeviationAlertsScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  nutritionStatus: ModuleRuntimeStatus;
  alertsCount: number;
};

export type DeviationAlertsScreenModel = {
  routeId: "web.route.deviationAlerts";
  screenId: "web.deviationAlerts.screen";
  status: DashboardHomeStatus;
  actions: {
    loadAlerts: "web.deviationAlerts.loadAlerts";
    clearFilters: "web.deviationAlerts.clearFilters";
  };
};

function resolveDeviationAlertsStatus(
  input: CreateDeviationAlertsScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.nutritionStatus === "loading" || input.nutritionStatus === "queued") {
    return "loading";
  }
  if (input.nutritionStatus === "offline") {
    return "offline";
  }
  if (input.nutritionStatus === "denied") {
    return "denied";
  }
  if (input.nutritionStatus === "error" || input.nutritionStatus === "validation_error") {
    return "error";
  }
  if (input.nutritionStatus === "empty" || input.alertsCount === 0) {
    return "empty";
  }
  return "success";
}

export function createDeviationAlertsScreenModel(
  input: CreateDeviationAlertsScreenModelInput
): DeviationAlertsScreenModel {
  return {
    routeId: "web.route.deviationAlerts",
    screenId: "web.deviationAlerts.screen",
    status: resolveDeviationAlertsStatus(input),
    actions: {
      loadAlerts: "web.deviationAlerts.loadAlerts",
      clearFilters: "web.deviationAlerts.clearFilters"
    }
  };
}
