import type { WebLane } from "./access-gate-lane-contract";
import {
  createSystemStatusScreenModel,
  type SystemStatusScreenModel
} from "./system-status-contract";

type CreateSystemStatusLaneScreenModelInput = {
  lane: WebLane;
  dashboardHomeStatus: "loading" | "empty" | "error" | "success" | "denied" | "offline";
  releaseCompatibilityStatus: "compatible" | "upgrade_required";
  roleCapabilitiesStatus: "idle" | "loading" | "loaded" | "error";
  pendingQueueCount: number;
  syncStatus: "idle" | "loading" | "synced" | "error";
};

export type SystemStatusLaneScreenModel = Omit<SystemStatusScreenModel, "screenId"> & {
  screenId: "web.systemStatus.screen" | "web.light.systemStatus.screen";
  actions: {
    syncQueue: "web.systemStatus.syncQueue" | "web.light.systemStatus.syncQueue";
    recoverDomain: "web.systemStatus.recoverDomain" | "web.light.systemStatus.recoverDomain";
    reloadCapabilities:
      | "web.systemStatus.reloadCapabilities"
      | "web.light.systemStatus.reloadCapabilities";
  };
};

export function createSystemStatusLaneScreenModel(
  input: CreateSystemStatusLaneScreenModelInput
): SystemStatusLaneScreenModel {
  const baseModel = createSystemStatusScreenModel({
    dashboardHomeStatus: input.dashboardHomeStatus,
    releaseCompatibilityStatus: input.releaseCompatibilityStatus,
    roleCapabilitiesStatus: input.roleCapabilitiesStatus,
    pendingQueueCount: input.pendingQueueCount,
    syncStatus: input.syncStatus
  });

  if (input.lane === "secondary") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.light.systemStatus.screen",
      status: baseModel.status,
      actions: {
        syncQueue: "web.light.systemStatus.syncQueue",
        recoverDomain: "web.light.systemStatus.recoverDomain",
        reloadCapabilities: "web.light.systemStatus.reloadCapabilities"
      }
    };
  }

  return {
    routeId: "web.route.dashboardHome",
    screenId: "web.systemStatus.screen",
    status: baseModel.status,
    actions: {
      syncQueue: "web.systemStatus.syncQueue",
      recoverDomain: "web.systemStatus.recoverDomain",
      reloadCapabilities: "web.systemStatus.reloadCapabilities"
    }
  };
}
