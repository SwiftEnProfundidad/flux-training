import { describe, expect, it } from "vitest";
import { createAlertsFullLaneScreenModel } from "./alerts-full-lane-contract";

describe("alerts full lane contract", () => {
  it("maps canonical ids for main lane", () => {
    expect(
      createAlertsFullLaneScreenModel({
        lane: "main",
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        openAlertsCount: 3,
        runbooksCount: 2
      })
    ).toEqual({
      routeId: "web.route.alertsFull",
      screenId: "web.alertsFull.screen",
      status: "success",
      actions: {
        refresh: "web.alertsFull.refresh",
        audit: "web.alertsFull.audit"
      }
    });
  });

  it("maps lane ids for secondary lane", () => {
    expect(
      createAlertsFullLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        openAlertsCount: 3,
        runbooksCount: 2
      })
    ).toEqual({
      routeId: "web.route.light.alertsFull",
      screenId: "web.light.alertsFull.screen",
      status: "success",
      actions: {
        refresh: "web.light.alertsFull.refresh",
        audit: "web.light.alertsFull.audit"
      }
    });
  });

  it("inherits error from base contract", () => {
    expect(
      createAlertsFullLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        observabilityStatus: "error",
        openAlertsCount: 3,
        runbooksCount: 2
      }).status
    ).toBe("error");
  });
});
