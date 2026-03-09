import { describe, expect, it } from "vitest";
import { createReadinessMonitorScreenModel } from "./readiness-monitor-contract";

describe("readiness monitor contract", () => {
  it("inherits loading/offline/denied/error from dashboard home", () => {
    expect(
      createReadinessMonitorScreenModel({
        dashboardHomeStatus: "offline",
        readinessScore: 80,
        authStatus: "signed_out"
      }).status
    ).toBe("offline");

    expect(
      createReadinessMonitorScreenModel({
        dashboardHomeStatus: "error",
        readinessScore: 80,
        authStatus: "signed_out"
      }).status
    ).toBe("error");
  });

  it("resolves loading with auth loading", () => {
    expect(
      createReadinessMonitorScreenModel({
        dashboardHomeStatus: "success",
        readinessScore: 80,
        authStatus: "loading"
      }).status
    ).toBe("loading");
  });

  it("resolves empty when readiness score is zero", () => {
    expect(
      createReadinessMonitorScreenModel({
        dashboardHomeStatus: "success",
        readinessScore: 0,
        authStatus: "signed_out"
      }).status
    ).toBe("empty");
  });

  it("returns success with positive readiness score", () => {
    expect(
      createReadinessMonitorScreenModel({
        dashboardHomeStatus: "success",
        readinessScore: 62,
        authStatus: "signed_out"
      })
    ).toEqual({
      routeId: "web.route.readinessMonitor",
      screenId: "web.readinessMonitor.screen",
      status: "success"
    });
  });
});
