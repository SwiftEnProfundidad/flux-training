import { describe, expect, it } from "vitest";
import { createAlertCenterLaneScreenModel } from "./alert-center-lane-contract";

describe("alert center lane contract", () => {
  it("returns main lane identifiers/actions", () => {
    expect(
      createAlertCenterLaneScreenModel({
        lane: "main",
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        openAlertsCount: 2
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.alertCenter.screen",
      status: "success",
      actions: {
        load: "web.alertCenter.load",
        audit: "web.alertCenter.audit"
      }
    });
  });

  it("returns secondary lane identifiers/actions and keeps status resolver", () => {
    expect(
      createAlertCenterLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        openAlertsCount: 0
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.light.alertCenter.screen",
      status: "empty",
      actions: {
        load: "web.light.alertCenter.load",
        audit: "web.light.alertCenter.audit"
      }
    });
  });
});
