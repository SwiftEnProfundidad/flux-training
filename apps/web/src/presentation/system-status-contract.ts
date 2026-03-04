import type { DashboardHomeStatus } from "./dashboard-home-contract";

type ReleaseCompatibilityStatus = "compatible" | "upgrade_required";
type RoleCapabilitiesStatus = "idle" | "loading" | "loaded" | "error";
type SyncStatus = "idle" | "loading" | "synced" | "error";

type CreateSystemStatusScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  releaseCompatibilityStatus: ReleaseCompatibilityStatus;
  roleCapabilitiesStatus: RoleCapabilitiesStatus;
  pendingQueueCount: number;
  syncStatus: SyncStatus;
};

export type SystemStatusScreenModel = {
  routeId: "web.route.dashboardHome";
  screenId: "web.systemStatus.screen";
  status: DashboardHomeStatus;
};

export function createSystemStatusScreenModel(
  input: CreateSystemStatusScreenModelInput
): SystemStatusScreenModel {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied"
  ) {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.systemStatus.screen",
      status: input.dashboardHomeStatus
    };
  }
  if (input.dashboardHomeStatus === "error") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.systemStatus.screen",
      status: "error"
    };
  }
  if (
    input.releaseCompatibilityStatus === "upgrade_required" ||
    input.roleCapabilitiesStatus === "error" ||
    input.syncStatus === "error"
  ) {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.systemStatus.screen",
      status: "error"
    };
  }
  if (input.roleCapabilitiesStatus === "loading" || input.syncStatus === "loading") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.systemStatus.screen",
      status: "loading"
    };
  }
  if (input.pendingQueueCount > 0) {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.systemStatus.screen",
      status: "loading"
    };
  }
  if (input.roleCapabilitiesStatus === "idle") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.systemStatus.screen",
      status: "empty"
    };
  }
  return {
    routeId: "web.route.dashboardHome",
    screenId: "web.systemStatus.screen",
    status: "success"
  };
}
