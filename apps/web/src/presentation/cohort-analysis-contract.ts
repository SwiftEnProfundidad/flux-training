import type { DashboardHomeStatus } from "./dashboard-home-contract";

type OperationsStatus =
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

type CreateCohortAnalysisScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  operationsStatus: OperationsStatus;
  cohortSize: number;
};

export type CohortAnalysisScreenModel = {
  routeId: "web.route.cohortAnalysis";
  screenId: "web.cohortAnalysis.screen";
  status: DashboardHomeStatus;
  actions: {
    refresh: "web.cohortAnalysis.refresh";
  };
};

export function createCohortAnalysisScreenModel(
  input: CreateCohortAnalysisScreenModelInput
): CohortAnalysisScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return {
      routeId: "web.route.cohortAnalysis",
      screenId: "web.cohortAnalysis.screen",
      status: input.dashboardHomeStatus,
      actions: {
        refresh: "web.cohortAnalysis.refresh"
      }
    };
  }

  if (input.operationsStatus === "loading" || input.operationsStatus === "queued") {
    return {
      routeId: "web.route.cohortAnalysis",
      screenId: "web.cohortAnalysis.screen",
      status: "loading",
      actions: {
        refresh: "web.cohortAnalysis.refresh"
      }
    };
  }

  if (input.operationsStatus === "offline") {
    return {
      routeId: "web.route.cohortAnalysis",
      screenId: "web.cohortAnalysis.screen",
      status: "offline",
      actions: {
        refresh: "web.cohortAnalysis.refresh"
      }
    };
  }

  if (input.operationsStatus === "denied") {
    return {
      routeId: "web.route.cohortAnalysis",
      screenId: "web.cohortAnalysis.screen",
      status: "denied",
      actions: {
        refresh: "web.cohortAnalysis.refresh"
      }
    };
  }

  if (input.operationsStatus === "error" || input.operationsStatus === "validation_error") {
    return {
      routeId: "web.route.cohortAnalysis",
      screenId: "web.cohortAnalysis.screen",
      status: "error",
      actions: {
        refresh: "web.cohortAnalysis.refresh"
      }
    };
  }

  if (input.operationsStatus === "empty" || input.cohortSize === 0) {
    return {
      routeId: "web.route.cohortAnalysis",
      screenId: "web.cohortAnalysis.screen",
      status: "empty",
      actions: {
        refresh: "web.cohortAnalysis.refresh"
      }
    };
  }

  return {
    routeId: "web.route.cohortAnalysis",
    screenId: "web.cohortAnalysis.screen",
    status: "success",
    actions: {
      refresh: "web.cohortAnalysis.refresh"
    }
  };
}
