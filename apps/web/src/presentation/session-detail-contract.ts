import type { DashboardHomeStatus } from "./dashboard-home-contract";

type TrainingRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error";

type CreateSessionDetailScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  trainingStatus: TrainingRuntimeStatus;
  sessionStatus: TrainingRuntimeStatus;
  sessionsCount: number;
  hasSelectedSession: boolean;
};

export type SessionDetailScreenModel = {
  routeId: "web.route.sessionDetail";
  screenId: "web.sessionDetail.screen";
  status: DashboardHomeStatus;
  actions: {
    loadSessions: "web.sessionDetail.loadSessions";
    selectSession: "web.sessionDetail.selectSession";
    clearSelection: "web.sessionDetail.clearSelection";
    openExerciseVideo: "web.sessionDetail.openExerciseVideo";
  };
};

function resolveSessionDetailStatus(input: CreateSessionDetailScreenModelInput): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (
    input.trainingStatus === "loading" ||
    input.trainingStatus === "queued" ||
    input.sessionStatus === "loading" ||
    input.sessionStatus === "queued"
  ) {
    return "loading";
  }

  if (
    input.trainingStatus === "error" ||
    input.trainingStatus === "validation_error" ||
    input.sessionStatus === "error" ||
    input.sessionStatus === "validation_error"
  ) {
    return "error";
  }

  if (input.sessionsCount === 0 || input.hasSelectedSession === false) {
    return "empty";
  }

  return "success";
}

export function createSessionDetailScreenModel(
  input: CreateSessionDetailScreenModelInput
): SessionDetailScreenModel {
  return {
    routeId: "web.route.sessionDetail",
    screenId: "web.sessionDetail.screen",
    status: resolveSessionDetailStatus(input),
    actions: {
      loadSessions: "web.sessionDetail.loadSessions",
      selectSession: "web.sessionDetail.selectSession",
      clearSelection: "web.sessionDetail.clearSelection",
      openExerciseVideo: "web.sessionDetail.openExerciseVideo"
    }
  };
}
