import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateCohortNutritionScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  nutritionStatus: ModuleRuntimeStatus;
  rowsCount: number;
};

export type CohortNutritionScreenModel = {
  routeId: "web.route.light.cohortNutrition";
  screenId: "web.light.cohortNutrition.screen";
  status: DashboardHomeStatus;
  actions: {
    loadCohort: "web.light.cohortNutrition.loadCohort";
    focusHighestRisk: "web.light.cohortNutrition.focusHighestRisk";
  };
};

function resolveCohortNutritionStatus(
  input: CreateCohortNutritionScreenModelInput
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
  if (input.nutritionStatus === "empty" || input.rowsCount === 0) {
    return "empty";
  }
  return "success";
}

export function createCohortNutritionScreenModel(
  input: CreateCohortNutritionScreenModelInput
): CohortNutritionScreenModel {
  return {
    routeId: "web.route.light.cohortNutrition",
    screenId: "web.light.cohortNutrition.screen",
    status: resolveCohortNutritionStatus(input),
    actions: {
      loadCohort: "web.light.cohortNutrition.loadCohort",
      focusHighestRisk: "web.light.cohortNutrition.focusHighestRisk"
    }
  };
}
