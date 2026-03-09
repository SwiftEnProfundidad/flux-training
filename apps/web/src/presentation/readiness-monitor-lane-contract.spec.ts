import { describe, expect, it } from "vitest";
import { createReadinessMonitorLaneScreenModel } from "./readiness-monitor-lane-contract";

describe("readiness monitor lane contract", () => {
  it("maps canonical ids for main lane", () => {
    expect(
      createReadinessMonitorLaneScreenModel({
        lane: "main",
        dashboardHomeStatus: "success",
        readinessScore: 72,
        authStatus: "signed_out"
      })
    ).toEqual({
      routeId: "web.route.readinessMonitor",
      screenId: "web.readinessMonitor.screen",
      status: "success",
      actions: {
        refresh: "web.readinessMonitor.refresh"
      }
    });
  });

  it("maps lane ids for secondary lane", () => {
    expect(
      createReadinessMonitorLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        readinessScore: 72,
        authStatus: "signed_out"
      })
    ).toEqual({
      routeId: "web.route.light.readinessMonitor",
      screenId: "web.light.readinessMonitor.screen",
      status: "success",
      actions: {
        refresh: "web.light.readinessMonitor.refresh"
      }
    });
  });

  it("inherits loading and empty from base contract", () => {
    expect(
      createReadinessMonitorLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "loading",
        readinessScore: 72,
        authStatus: "signed_out"
      }).status
    ).toBe("loading");

    expect(
      createReadinessMonitorLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        readinessScore: 0,
        authStatus: "signed_out"
      }).status
    ).toBe("empty");
  });
});
