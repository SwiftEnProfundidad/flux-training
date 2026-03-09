import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";
import type { WebLane } from "./access-gate-lane-contract";

type CreateAthletesListScreenModelInput = {
  lane?: WebLane;
  dashboardHomeStatus: DashboardHomeStatus;
  operationsStatus: ModuleRuntimeStatus;
  rowsCount: number;
};

export type AthletesListScreenModel = {
  routeId: "web.route.athletesList" | "web.route.light.athletesList";
  screenId: "web.athletesList.screen" | "web.light.athletesList.screen";
  status: DashboardHomeStatus;
  actions: {
    assignStarterPlan:
      | "web.athletesList.assignStarterPlan"
      | "web.light.athletesList.assignStarterPlan";
    clearSelection:
      | "web.athletesList.clearSelection"
      | "web.light.athletesList.clearSelection";
    showMoreRows:
      | "web.athletesList.showMoreRows"
      | "web.light.athletesList.showMoreRows";
    showAllRows:
      | "web.athletesList.showAllRows"
      | "web.light.athletesList.showAllRows";
  };
};

function resolveAthletesListStatus(
  input: CreateAthletesListScreenModelInput
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
  if (input.operationsStatus === "empty" || input.rowsCount === 0) {
    return "empty";
  }
  return "success";
}

export function createAthletesListScreenModel(
  input: CreateAthletesListScreenModelInput
): AthletesListScreenModel {
  const isMainLane = input.lane !== "secondary";
  return {
    routeId: isMainLane ? "web.route.athletesList" : "web.route.light.athletesList",
    screenId: isMainLane ? "web.athletesList.screen" : "web.light.athletesList.screen",
    status: resolveAthletesListStatus(input),
    actions: {
      assignStarterPlan: isMainLane
        ? "web.athletesList.assignStarterPlan"
        : "web.light.athletesList.assignStarterPlan",
      clearSelection: isMainLane
        ? "web.athletesList.clearSelection"
        : "web.light.athletesList.clearSelection",
      showMoreRows: isMainLane
        ? "web.athletesList.showMoreRows"
        : "web.light.athletesList.showMoreRows",
      showAllRows: isMainLane
        ? "web.athletesList.showAllRows"
        : "web.light.athletesList.showAllRows"
    }
  };
}
