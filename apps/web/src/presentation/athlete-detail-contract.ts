import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";
import type { WebLane } from "./access-gate-lane-contract";

type CreateAthleteDetailScreenModelInput = {
  lane?: WebLane;
  dashboardHomeStatus: DashboardHomeStatus;
  operationsStatus: ModuleRuntimeStatus;
  selectedAthleteCount: number;
};

export type AthleteDetailScreenModel = {
  routeId: "web.route.athleteDetail" | "web.route.light.athleteDetail";
  screenId: "web.athleteDetail.screen" | "web.light.athleteDetail.screen";
  status: DashboardHomeStatus;
  actions: {
    selectFirstAthlete:
      | "web.athleteDetail.selectFirstAthlete"
      | "web.light.athleteDetail.selectFirstAthlete";
    openSessionHistory:
      | "web.athleteDetail.openSessionHistory"
      | "web.light.athleteDetail.openSessionHistory";
    clearSelection:
      | "web.athleteDetail.clearSelection"
      | "web.light.athleteDetail.clearSelection";
  };
};

function resolveAthleteDetailStatus(
  input: CreateAthleteDetailScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.operationsStatus === "loading" || input.operationsStatus === "queued") {
    return "loading";
  }
  if (input.operationsStatus === "offline") {
    return "offline";
  }
  if (input.operationsStatus === "denied") {
    return "denied";
  }
  if (
    input.operationsStatus === "error" ||
    input.operationsStatus === "validation_error"
  ) {
    return "error";
  }
  if (input.operationsStatus === "empty" || input.selectedAthleteCount === 0) {
    return "empty";
  }
  return "success";
}

export function createAthleteDetailScreenModel(
  input: CreateAthleteDetailScreenModelInput
): AthleteDetailScreenModel {
  const isMainLane = input.lane !== "secondary";
  return {
    routeId: isMainLane ? "web.route.athleteDetail" : "web.route.light.athleteDetail",
    screenId: isMainLane ? "web.athleteDetail.screen" : "web.light.athleteDetail.screen",
    status: resolveAthleteDetailStatus(input),
    actions: {
      selectFirstAthlete: isMainLane
        ? "web.athleteDetail.selectFirstAthlete"
        : "web.light.athleteDetail.selectFirstAthlete",
      openSessionHistory: isMainLane
        ? "web.athleteDetail.openSessionHistory"
        : "web.light.athleteDetail.openSessionHistory",
      clearSelection: isMainLane
        ? "web.athleteDetail.clearSelection"
        : "web.light.athleteDetail.clearSelection"
    }
  };
}
