import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateNutritionOverviewScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  nutritionStatus: ModuleRuntimeStatus;
  logsCount: number;
  filteredLogsCount: number;
};

export type NutritionOverviewScreenModel = {
  routeId: "web.route.nutritionOverview";
  screenId: "web.nutritionOverview.screen";
  status: DashboardHomeStatus;
  actions: {
    saveLog: "web.nutritionOverview.saveLog";
    loadLogs: "web.nutritionOverview.loadLogs";
    clearFilters: "web.nutritionOverview.clearFilters";
  };
};

function resolveNutritionOverviewStatus(
  input: CreateNutritionOverviewScreenModelInput
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
  if (
    input.nutritionStatus === "empty" ||
    input.logsCount === 0 ||
    input.filteredLogsCount === 0
  ) {
    return "empty";
  }
  return "success";
}

export function createNutritionOverviewScreenModel(
  input: CreateNutritionOverviewScreenModelInput
): NutritionOverviewScreenModel {
  return {
    routeId: "web.route.nutritionOverview",
    screenId: "web.nutritionOverview.screen",
    status: resolveNutritionOverviewStatus(input),
    actions: {
      saveLog: "web.nutritionOverview.saveLog",
      loadLogs: "web.nutritionOverview.loadLogs",
      clearFilters: "web.nutritionOverview.clearFilters"
    }
  };
}
