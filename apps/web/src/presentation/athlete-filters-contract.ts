import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";
import type { WebLane } from "./access-gate-lane-contract";

type CreateAthleteFiltersScreenModelInput = {
  lane?: WebLane;
  dashboardHomeStatus: DashboardHomeStatus;
  operationsStatus: ModuleRuntimeStatus;
  rowsCount: number;
};

export type AthleteFiltersScreenModel = {
  routeId: "web.route.athleteFilters" | "web.route.light.athleteFilters";
  screenId: "web.athleteFilters.screen" | "web.light.athleteFilters.screen";
  status: DashboardHomeStatus;
  actions: {
    updateSearch:
      | "web.athleteFilters.updateSearch"
      | "web.light.athleteFilters.updateSearch";
    updateSort:
      | "web.athleteFilters.updateSort"
      | "web.light.athleteFilters.updateSort";
  };
};

function resolveAthleteFiltersStatus(
  input: CreateAthleteFiltersScreenModelInput
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

export function createAthleteFiltersScreenModel(
  input: CreateAthleteFiltersScreenModelInput
): AthleteFiltersScreenModel {
  const isMainLane = input.lane !== "secondary";
  return {
    routeId: isMainLane ? "web.route.athleteFilters" : "web.route.light.athleteFilters",
    screenId: isMainLane ? "web.athleteFilters.screen" : "web.light.athleteFilters.screen",
    status: resolveAthleteFiltersStatus(input),
    actions: {
      updateSearch: isMainLane
        ? "web.athleteFilters.updateSearch"
        : "web.light.athleteFilters.updateSearch",
      updateSort: isMainLane
        ? "web.athleteFilters.updateSort"
        : "web.light.athleteFilters.updateSort"
    }
  };
}
