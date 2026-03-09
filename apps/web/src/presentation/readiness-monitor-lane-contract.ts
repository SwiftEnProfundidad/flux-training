import type { WebLane } from "./access-gate-lane-contract";
import {
  createReadinessMonitorScreenModel,
  type ReadinessMonitorScreenModel
} from "./readiness-monitor-contract";

type CreateReadinessMonitorLaneScreenModelInput = {
  lane: WebLane;
  dashboardHomeStatus: "loading" | "empty" | "error" | "success" | "denied" | "offline";
  readinessScore: number;
  authStatus: string;
};

export type ReadinessMonitorLaneScreenModel = Omit<
  ReadinessMonitorScreenModel,
  "routeId" | "screenId"
> & {
  routeId: "web.route.readinessMonitor" | "web.route.light.readinessMonitor";
  screenId: "web.readinessMonitor.screen" | "web.light.readinessMonitor.screen";
  actions: {
    refresh: "web.readinessMonitor.refresh" | "web.light.readinessMonitor.refresh";
  };
};

export function createReadinessMonitorLaneScreenModel(
  input: CreateReadinessMonitorLaneScreenModelInput
): ReadinessMonitorLaneScreenModel {
  const baseModel = createReadinessMonitorScreenModel({
    dashboardHomeStatus: input.dashboardHomeStatus,
    readinessScore: input.readinessScore,
    authStatus: input.authStatus
  });

  if (input.lane === "secondary") {
    return {
      routeId: "web.route.light.readinessMonitor",
      screenId: "web.light.readinessMonitor.screen",
      status: baseModel.status,
      actions: {
        refresh: "web.light.readinessMonitor.refresh"
      }
    };
  }

  return {
    routeId: "web.route.readinessMonitor",
    screenId: "web.readinessMonitor.screen",
    status: baseModel.status,
    actions: {
      refresh: "web.readinessMonitor.refresh"
    }
  };
}
