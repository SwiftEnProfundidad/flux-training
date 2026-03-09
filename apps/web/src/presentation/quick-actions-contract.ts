import type { DashboardHomeStatus } from "./dashboard-home-contract";

type TrainingStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error";
type NutritionStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error"
  | "empty"
  | "offline"
  | "denied";
type ProgressStatus = NutritionStatus;
type RecommendationsStatus = "idle" | "loading" | "loaded" | "empty" | "error";
type SyncStatus = "idle" | "loading" | "synced" | "error";

type CreateQuickActionsScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  trainingStatus: TrainingStatus;
  nutritionStatus: NutritionStatus;
  progressStatus: ProgressStatus;
  recommendationsStatus: RecommendationsStatus;
  syncStatus: SyncStatus;
};

export type QuickActionsScreenModel = {
  routeId: "web.route.dashboardHome";
  screenId: "web.quickActions.screen";
  status: DashboardHomeStatus;
};

function hasErrorStatus(
  statuses: Array<
    TrainingStatus | NutritionStatus | ProgressStatus | RecommendationsStatus | SyncStatus
  >
): boolean {
  return statuses.some((status) => status === "error" || status === "validation_error");
}

function hasLoadingStatus(
  statuses: Array<
    TrainingStatus | NutritionStatus | ProgressStatus | RecommendationsStatus | SyncStatus
  >
): boolean {
  return statuses.some((status) => status === "loading" || status === "queued");
}

function hasDataStatus(
  statuses: Array<
    TrainingStatus | NutritionStatus | ProgressStatus | RecommendationsStatus | SyncStatus
  >
): boolean {
  return statuses.some(
    (status) => status === "loaded" || status === "saved" || status === "synced"
  );
}

export function createQuickActionsScreenModel(
  input: CreateQuickActionsScreenModelInput
): QuickActionsScreenModel {
  const upstreamStatus = input.dashboardHomeStatus;
  if (upstreamStatus === "loading" || upstreamStatus === "offline" || upstreamStatus === "denied") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.quickActions.screen",
      status: upstreamStatus
    };
  }
  if (upstreamStatus === "error") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.quickActions.screen",
      status: "error"
    };
  }

  const statuses = [
    input.trainingStatus,
    input.nutritionStatus,
    input.progressStatus,
    input.recommendationsStatus,
    input.syncStatus
  ];
  if (hasLoadingStatus(statuses)) {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.quickActions.screen",
      status: "loading"
    };
  }
  if (hasErrorStatus(statuses)) {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.quickActions.screen",
      status: "error"
    };
  }
  if (statuses.some((status) => status === "offline")) {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.quickActions.screen",
      status: "offline"
    };
  }
  if (hasDataStatus(statuses) === false || upstreamStatus === "empty") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.quickActions.screen",
      status: "empty"
    };
  }
  return {
    routeId: "web.route.dashboardHome",
    screenId: "web.quickActions.screen",
    status: "success"
  };
}
