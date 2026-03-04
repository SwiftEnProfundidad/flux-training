import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";
import type { WebLane } from "./access-gate-lane-contract";

type CreateCompareProgressScreenModelInput = {
  lane?: WebLane;
  dashboardHomeStatus: DashboardHomeStatus;
  progressStatus: ModuleRuntimeStatus;
  selectedAthleteCount: number;
  cohortSize: number;
};

export type CompareProgressScreenModel = {
  routeId: "web.route.compareProgress" | "web.route.light.compareProgress";
  screenId: "web.compareProgress.screen" | "web.light.compareProgress.screen";
  status: DashboardHomeStatus;
  actions: {
    loadProgress:
      | "web.compareProgress.loadProgress"
      | "web.light.compareProgress.loadProgress";
    selectFirstAthlete:
      | "web.compareProgress.selectFirstAthlete"
      | "web.light.compareProgress.selectFirstAthlete";
    openSessionHistory:
      | "web.compareProgress.openSessionHistory"
      | "web.light.compareProgress.openSessionHistory";
  };
};

function resolveCompareProgressStatus(
  input: CreateCompareProgressScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.progressStatus === "loading" || input.progressStatus === "queued") {
    return "loading";
  }
  if (input.progressStatus === "offline") {
    return "offline";
  }
  if (input.progressStatus === "denied") {
    return "denied";
  }
  if (
    input.progressStatus === "error" ||
    input.progressStatus === "validation_error"
  ) {
    return "error";
  }
  if (
    input.progressStatus === "empty" ||
    input.selectedAthleteCount === 0 ||
    input.cohortSize === 0
  ) {
    return "empty";
  }
  return "success";
}

export function createCompareProgressScreenModel(
  input: CreateCompareProgressScreenModelInput
): CompareProgressScreenModel {
  const isMainLane = input.lane !== "secondary";
  return {
    routeId: isMainLane ? "web.route.compareProgress" : "web.route.light.compareProgress",
    screenId: isMainLane ? "web.compareProgress.screen" : "web.light.compareProgress.screen",
    status: resolveCompareProgressStatus(input),
    actions: {
      loadProgress: isMainLane
        ? "web.compareProgress.loadProgress"
        : "web.light.compareProgress.loadProgress",
      selectFirstAthlete: isMainLane
        ? "web.compareProgress.selectFirstAthlete"
        : "web.light.compareProgress.selectFirstAthlete",
      openSessionHistory: isMainLane
        ? "web.compareProgress.openSessionHistory"
        : "web.light.compareProgress.openSessionHistory"
    }
  };
}
