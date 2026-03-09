import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateDailyLogReviewScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  nutritionStatus: ModuleRuntimeStatus;
  filteredLogsCount: number;
};

export type DailyLogReviewScreenModel = {
  routeId: "web.route.dailyLogReview";
  screenId: "web.dailyLogReview.screen";
  status: DashboardHomeStatus;
  actions: {
    updateFilters: "web.dailyLogReview.updateFilters";
    updateSort: "web.dailyLogReview.updateSort";
    clearFilters: "web.dailyLogReview.clearFilters";
  };
};

function resolveDailyLogReviewStatus(
  input: CreateDailyLogReviewScreenModelInput
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
  if (input.nutritionStatus === "empty" || input.filteredLogsCount === 0) {
    return "empty";
  }
  return "success";
}

export function createDailyLogReviewScreenModel(
  input: CreateDailyLogReviewScreenModelInput
): DailyLogReviewScreenModel {
  return {
    routeId: "web.route.dailyLogReview",
    screenId: "web.dailyLogReview.screen",
    status: resolveDailyLogReviewStatus(input),
    actions: {
      updateFilters: "web.dailyLogReview.updateFilters",
      updateSort: "web.dailyLogReview.updateSort",
      clearFilters: "web.dailyLogReview.clearFilters"
    }
  };
}
