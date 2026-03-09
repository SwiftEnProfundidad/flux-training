import type { DashboardHomeStatus } from "./dashboard-home-contract";

type ProgressModuleStatus =
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

type CreateProgressTrendsScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  progressStatus: ProgressModuleStatus;
  historyCount: number;
};

export type ProgressTrendsScreenModel = {
  routeId: "web.route.progressTrends";
  screenId: "web.progressTrends.screen";
  status: DashboardHomeStatus;
  actions: {
    refresh: "web.progressTrends.refresh";
  };
};

export function createProgressTrendsScreenModel(
  input: CreateProgressTrendsScreenModelInput
): ProgressTrendsScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return {
      routeId: "web.route.progressTrends",
      screenId: "web.progressTrends.screen",
      status: input.dashboardHomeStatus,
      actions: {
        refresh: "web.progressTrends.refresh"
      }
    };
  }

  if (input.progressStatus === "loading" || input.progressStatus === "queued") {
    return {
      routeId: "web.route.progressTrends",
      screenId: "web.progressTrends.screen",
      status: "loading",
      actions: {
        refresh: "web.progressTrends.refresh"
      }
    };
  }

  if (input.progressStatus === "offline") {
    return {
      routeId: "web.route.progressTrends",
      screenId: "web.progressTrends.screen",
      status: "offline",
      actions: {
        refresh: "web.progressTrends.refresh"
      }
    };
  }

  if (input.progressStatus === "denied") {
    return {
      routeId: "web.route.progressTrends",
      screenId: "web.progressTrends.screen",
      status: "denied",
      actions: {
        refresh: "web.progressTrends.refresh"
      }
    };
  }

  if (input.progressStatus === "error" || input.progressStatus === "validation_error") {
    return {
      routeId: "web.route.progressTrends",
      screenId: "web.progressTrends.screen",
      status: "error",
      actions: {
        refresh: "web.progressTrends.refresh"
      }
    };
  }

  if (input.progressStatus === "empty" || input.historyCount === 0) {
    return {
      routeId: "web.route.progressTrends",
      screenId: "web.progressTrends.screen",
      status: "empty",
      actions: {
        refresh: "web.progressTrends.refresh"
      }
    };
  }

  return {
    routeId: "web.route.progressTrends",
    screenId: "web.progressTrends.screen",
    status: "success",
    actions: {
      refresh: "web.progressTrends.refresh"
    }
  };
}
