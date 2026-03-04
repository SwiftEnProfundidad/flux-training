import { describe, expect, it } from "vitest";
import { createSystemStatusScreenModel } from "./system-status-contract";

describe("system status contract", () => {
  it("inherits denied/offline/loading from dashboard home", () => {
    expect(
      createSystemStatusScreenModel({
        dashboardHomeStatus: "denied",
        releaseCompatibilityStatus: "compatible",
        roleCapabilitiesStatus: "loaded",
        pendingQueueCount: 0,
        syncStatus: "idle"
      }).status
    ).toBe("denied");

    expect(
      createSystemStatusScreenModel({
        dashboardHomeStatus: "offline",
        releaseCompatibilityStatus: "compatible",
        roleCapabilitiesStatus: "loaded",
        pendingQueueCount: 0,
        syncStatus: "idle"
      }).status
    ).toBe("offline");
  });

  it("resolves error for upgrade required and failing runtime signals", () => {
    expect(
      createSystemStatusScreenModel({
        dashboardHomeStatus: "success",
        releaseCompatibilityStatus: "upgrade_required",
        roleCapabilitiesStatus: "loaded",
        pendingQueueCount: 0,
        syncStatus: "idle"
      }).status
    ).toBe("error");

    expect(
      createSystemStatusScreenModel({
        dashboardHomeStatus: "success",
        releaseCompatibilityStatus: "compatible",
        roleCapabilitiesStatus: "error",
        pendingQueueCount: 0,
        syncStatus: "idle"
      }).status
    ).toBe("error");
  });

  it("resolves loading when sync/capabilities are in progress or queue has backlog", () => {
    expect(
      createSystemStatusScreenModel({
        dashboardHomeStatus: "success",
        releaseCompatibilityStatus: "compatible",
        roleCapabilitiesStatus: "loading",
        pendingQueueCount: 0,
        syncStatus: "idle"
      }).status
    ).toBe("loading");

    expect(
      createSystemStatusScreenModel({
        dashboardHomeStatus: "success",
        releaseCompatibilityStatus: "compatible",
        roleCapabilitiesStatus: "loaded",
        pendingQueueCount: 2,
        syncStatus: "idle"
      }).status
    ).toBe("loading");
  });

  it("returns empty before role matrix load and success after stabilization", () => {
    expect(
      createSystemStatusScreenModel({
        dashboardHomeStatus: "success",
        releaseCompatibilityStatus: "compatible",
        roleCapabilitiesStatus: "idle",
        pendingQueueCount: 0,
        syncStatus: "idle"
      }).status
    ).toBe("empty");

    expect(
      createSystemStatusScreenModel({
        dashboardHomeStatus: "success",
        releaseCompatibilityStatus: "compatible",
        roleCapabilitiesStatus: "loaded",
        pendingQueueCount: 0,
        syncStatus: "synced"
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.systemStatus.screen",
      status: "success"
    });
  });
});
