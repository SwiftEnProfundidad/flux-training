import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateNutritionLogDetailScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  nutritionStatus: ModuleRuntimeStatus;
  logsCount: number;
  hasSelectedLog: boolean;
};

export type NutritionLogDetailScreenModel = {
  routeId: "web.route.light.logDetail";
  screenId: "web.light.logDetail.screen";
  status: DashboardHomeStatus;
  actions: {
    loadDetail: "web.light.logDetail.loadDetail";
    selectLog: "web.light.logDetail.selectLog";
    clearSelection: "web.light.logDetail.clearSelection";
    openCoachView: "web.light.logDetail.openCoachView";
  };
};

function resolveNutritionLogDetailStatus(
  input: CreateNutritionLogDetailScreenModelInput
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
  if (input.nutritionStatus === "empty" || input.logsCount === 0) {
    return "empty";
  }
  if (input.hasSelectedLog) {
    return "success";
  }
  return "empty";
}

export function createNutritionLogDetailScreenModel(
  input: CreateNutritionLogDetailScreenModelInput
): NutritionLogDetailScreenModel {
  return {
    routeId: "web.route.light.logDetail",
    screenId: "web.light.logDetail.screen",
    status: resolveNutritionLogDetailStatus(input),
    actions: {
      loadDetail: "web.light.logDetail.loadDetail",
      selectLog: "web.light.logDetail.selectLog",
      clearSelection: "web.light.logDetail.clearSelection",
      openCoachView: "web.light.logDetail.openCoachView"
    }
  };
}
