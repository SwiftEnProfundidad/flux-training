import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateSupportIncidentsScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  billingSupportStatus: ModuleRuntimeStatus;
  incidentsCount: number;
};

export type SupportIncidentsScreenModel = {
  routeId: "web.route.supportIncidents";
  screenId: "web.supportIncidents.screen";
  status: DashboardHomeStatus;
  actions: {
    loadData: "web.supportIncidents.loadData";
    resolveSelected: "web.supportIncidents.resolveSelected";
    clearSelection: "web.supportIncidents.clearSelection";
    clearFilters: "web.supportIncidents.clearFilters";
  };
};

function resolveSupportIncidentsStatus(
  input: CreateSupportIncidentsScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.billingSupportStatus === "loading" || input.billingSupportStatus === "queued") {
    return "loading";
  }
  if (input.billingSupportStatus === "offline") {
    return "offline";
  }
  if (input.billingSupportStatus === "denied") {
    return "denied";
  }
  if (
    input.billingSupportStatus === "error" ||
    input.billingSupportStatus === "validation_error"
  ) {
    return "error";
  }
  if (input.billingSupportStatus === "empty" || input.incidentsCount === 0) {
    return "empty";
  }
  return "success";
}

export function createSupportIncidentsScreenModel(
  input: CreateSupportIncidentsScreenModelInput
): SupportIncidentsScreenModel {
  return {
    routeId: "web.route.supportIncidents",
    screenId: "web.supportIncidents.screen",
    status: resolveSupportIncidentsStatus(input),
    actions: {
      loadData: "web.supportIncidents.loadData",
      resolveSelected: "web.supportIncidents.resolveSelected",
      clearSelection: "web.supportIncidents.clearSelection",
      clearFilters: "web.supportIncidents.clearFilters"
    }
  };
}
