import type { WebLane } from "./access-gate-lane-contract";
import {
  createAlertCenterScreenModel,
  type AlertCenterScreenModel
} from "./alert-center-contract";

type CreateAlertCenterLaneScreenModelInput = {
  lane: WebLane;
  dashboardHomeStatus: "loading" | "empty" | "error" | "success" | "denied" | "offline";
  observabilityStatus: "idle" | "loading" | "event_saved" | "crash_saved" | "loaded" | "error";
  openAlertsCount: number;
};

export type AlertCenterLaneScreenModel = Omit<AlertCenterScreenModel, "screenId"> & {
  screenId: "web.alertCenter.screen" | "web.light.alertCenter.screen";
  actions: {
    load: "web.alertCenter.load" | "web.light.alertCenter.load";
    audit: "web.alertCenter.audit" | "web.light.alertCenter.audit";
  };
};

export function createAlertCenterLaneScreenModel(
  input: CreateAlertCenterLaneScreenModelInput
): AlertCenterLaneScreenModel {
  const baseModel = createAlertCenterScreenModel({
    dashboardHomeStatus: input.dashboardHomeStatus,
    observabilityStatus: input.observabilityStatus,
    openAlertsCount: input.openAlertsCount
  });

  if (input.lane === "secondary") {
    return {
      routeId: "web.route.dashboardHome",
      screenId: "web.light.alertCenter.screen",
      status: baseModel.status,
      actions: {
        load: "web.light.alertCenter.load",
        audit: "web.light.alertCenter.audit"
      }
    };
  }

  return {
    routeId: "web.route.dashboardHome",
    screenId: "web.alertCenter.screen",
    status: baseModel.status,
    actions: {
      load: "web.alertCenter.load",
      audit: "web.alertCenter.audit"
    }
  };
}
