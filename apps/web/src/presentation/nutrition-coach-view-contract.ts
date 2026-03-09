import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateNutritionCoachViewScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  nutritionStatus: ModuleRuntimeStatus;
  logsCount: number;
  atRiskAthletesCount: number;
};

export type NutritionCoachViewScreenModel = {
  routeId: "web.route.nutritionCoachView";
  screenId: "web.nutritionCoachView.screen";
  status: DashboardHomeStatus;
  actions: {
    loadCohort: "web.nutritionCoachView.loadCohort";
    focusAtRisk: "web.nutritionCoachView.focusAtRisk";
    openOperations: "web.nutritionCoachView.openOperations";
  };
};

function resolveNutritionCoachViewStatus(
  input: CreateNutritionCoachViewScreenModelInput
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
  if (input.atRiskAthletesCount >= 0) {
    return "success";
  }
  return "empty";
}

export function createNutritionCoachViewScreenModel(
  input: CreateNutritionCoachViewScreenModelInput
): NutritionCoachViewScreenModel {
  return {
    routeId: "web.route.nutritionCoachView",
    screenId: "web.nutritionCoachView.screen",
    status: resolveNutritionCoachViewStatus(input),
    actions: {
      loadCohort: "web.nutritionCoachView.loadCohort",
      focusAtRisk: "web.nutritionCoachView.focusAtRisk",
      openOperations: "web.nutritionCoachView.openOperations"
    }
  };
}
