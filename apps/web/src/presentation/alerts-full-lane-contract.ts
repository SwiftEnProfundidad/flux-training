import type { WebLane } from "./access-gate-lane-contract";
import {
  createAlertsFullScreenModel,
  type AlertsFullScreenModel
} from "./alerts-full-contract";

type CreateAlertsFullLaneScreenModelInput = {
  lane: WebLane;
  dashboardHomeStatus: "loading" | "empty" | "error" | "success" | "denied" | "offline";
  observabilityStatus: "idle" | "loading" | "event_saved" | "crash_saved" | "loaded" | "error";
  openAlertsCount: number;
  runbooksCount: number;
};

export type AlertsFullLaneScreenModel = Omit<AlertsFullScreenModel, "routeId" | "screenId"> & {
  routeId: "web.route.alertsFull" | "web.route.light.alertsFull";
  screenId: "web.alertsFull.screen" | "web.light.alertsFull.screen";
  actions: {
    refresh: "web.alertsFull.refresh" | "web.light.alertsFull.refresh";
    audit: "web.alertsFull.audit" | "web.light.alertsFull.audit";
  };
};

export function createAlertsFullLaneScreenModel(
  input: CreateAlertsFullLaneScreenModelInput
): AlertsFullLaneScreenModel {
  const baseModel = createAlertsFullScreenModel({
    dashboardHomeStatus: input.dashboardHomeStatus,
    observabilityStatus: input.observabilityStatus,
    openAlertsCount: input.openAlertsCount,
    runbooksCount: input.runbooksCount
  });

  if (input.lane === "secondary") {
    return {
      routeId: "web.route.light.alertsFull",
      screenId: "web.light.alertsFull.screen",
      status: baseModel.status,
      actions: {
        refresh: "web.light.alertsFull.refresh",
        audit: "web.light.alertsFull.audit"
      }
    };
  }

  return {
    routeId: "web.route.alertsFull",
    screenId: "web.alertsFull.screen",
    status: baseModel.status,
    actions: {
      refresh: "web.alertsFull.refresh",
      audit: "web.alertsFull.audit"
    }
  };
}
