import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateAuditTrailScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  auditStatus: ModuleRuntimeStatus;
  rowsCount: number;
};

export type AuditTrailScreenModel = {
  routeId: "web.route.auditTrail";
  screenId: "web.auditTrail.screen";
  status: DashboardHomeStatus;
  actions: {
    loadTimeline: "web.auditTrail.loadTimeline";
    exportCsv: "web.auditTrail.exportCsv";
    exportForensic: "web.auditTrail.exportForensic";
    clearFilters: "web.auditTrail.clearFilters";
  };
};

function resolveAuditTrailStatus(input: CreateAuditTrailScreenModelInput): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.auditStatus === "loading" || input.auditStatus === "queued") {
    return "loading";
  }
  if (input.auditStatus === "offline") {
    return "offline";
  }
  if (input.auditStatus === "denied") {
    return "denied";
  }
  if (input.auditStatus === "error" || input.auditStatus === "validation_error") {
    return "error";
  }
  if (input.auditStatus === "empty" || input.rowsCount === 0) {
    return "empty";
  }
  return "success";
}

export function createAuditTrailScreenModel(
  input: CreateAuditTrailScreenModelInput
): AuditTrailScreenModel {
  return {
    routeId: "web.route.auditTrail",
    screenId: "web.auditTrail.screen",
    status: resolveAuditTrailStatus(input),
    actions: {
      loadTimeline: "web.auditTrail.loadTimeline",
      exportCsv: "web.auditTrail.exportCsv",
      exportForensic: "web.auditTrail.exportForensic",
      clearFilters: "web.auditTrail.clearFilters"
    }
  };
}
