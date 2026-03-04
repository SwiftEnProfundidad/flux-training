import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { WebLane } from "./access-gate-lane-contract";

type SessionRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "queued"
  | "validation_error"
  | "error";

type CreateSessionHistoryScreenModelInput = {
  lane?: WebLane;
  dashboardHomeStatus: DashboardHomeStatus;
  sessionStatus: SessionRuntimeStatus;
  selectedAthleteCount: number;
  rowsCount: number;
};

export type SessionHistoryScreenModel = {
  routeId: "web.route.sessionHistory" | "web.route.light.sessionHistory";
  screenId: "web.sessionHistory.screen" | "web.light.sessionHistory.screen";
  status: DashboardHomeStatus;
  actions: {
    loadSessions:
      | "web.sessionHistory.loadSessions"
      | "web.light.sessionHistory.loadSessions";
    selectFirstAthlete:
      | "web.sessionHistory.selectFirstAthlete"
      | "web.light.sessionHistory.selectFirstAthlete";
    clearSelection:
      | "web.sessionHistory.clearSelection"
      | "web.light.sessionHistory.clearSelection";
  };
};

function resolveSessionHistoryStatus(
  input: CreateSessionHistoryScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.sessionStatus === "loading" || input.sessionStatus === "queued") {
    return "loading";
  }
  if (input.sessionStatus === "error" || input.sessionStatus === "validation_error") {
    return "error";
  }
  if (input.selectedAthleteCount === 0 || input.rowsCount === 0) {
    return "empty";
  }
  return "success";
}

export function createSessionHistoryScreenModel(
  input: CreateSessionHistoryScreenModelInput
): SessionHistoryScreenModel {
  const isMainLane = input.lane !== "secondary";
  return {
    routeId: isMainLane ? "web.route.sessionHistory" : "web.route.light.sessionHistory",
    screenId: isMainLane ? "web.sessionHistory.screen" : "web.light.sessionHistory.screen",
    status: resolveSessionHistoryStatus(input),
    actions: {
      loadSessions: isMainLane
        ? "web.sessionHistory.loadSessions"
        : "web.light.sessionHistory.loadSessions",
      selectFirstAthlete: isMainLane
        ? "web.sessionHistory.selectFirstAthlete"
        : "web.light.sessionHistory.selectFirstAthlete",
      clearSelection: isMainLane
        ? "web.sessionHistory.clearSelection"
        : "web.light.sessionHistory.clearSelection"
    }
  };
}
