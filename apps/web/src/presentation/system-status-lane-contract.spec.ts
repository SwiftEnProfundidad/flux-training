import { describe, expect, it } from "vitest";
import { createSystemStatusLaneScreenModel } from "./system-status-lane-contract";

describe("system status lane contract", () => {
  it("returns main lane identifiers/actions", () => {
    expect(
      createSystemStatusLaneScreenModel({
        lane: "main",
        dashboardHomeStatus: "success",
        releaseCompatibilityStatus: "compatible",
        roleCapabilitiesStatus: "loaded",
        pendingQueueCount: 0,
        syncStatus: "synced"
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.systemStatus.screen",
      status: "success",
      actions: {
        syncQueue: "web.systemStatus.syncQueue",
        recoverDomain: "web.systemStatus.recoverDomain",
        reloadCapabilities: "web.systemStatus.reloadCapabilities"
      }
    });
  });

  it("returns secondary lane identifiers/actions and keeps status resolver", () => {
    expect(
      createSystemStatusLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        releaseCompatibilityStatus: "compatible",
        roleCapabilitiesStatus: "idle",
        pendingQueueCount: 0,
        syncStatus: "idle"
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.light.systemStatus.screen",
      status: "empty",
      actions: {
        syncQueue: "web.light.systemStatus.syncQueue",
        recoverDomain: "web.light.systemStatus.recoverDomain",
        reloadCapabilities: "web.light.systemStatus.reloadCapabilities"
      }
    });
  });
});
