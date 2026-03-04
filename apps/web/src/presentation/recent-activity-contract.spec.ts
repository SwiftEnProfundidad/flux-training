import { describe, expect, it } from "vitest";
import { createRecentActivityScreenModel } from "./recent-activity-contract";

describe("recent activity contract", () => {
  it("inherits denied and offline from dashboard home", () => {
    expect(
      createRecentActivityScreenModel({
        dashboardHomeStatus: "denied",
        observabilityStatus: "loaded",
        activityEntriesCount: 8
      }).status
    ).toBe("denied");

    expect(
      createRecentActivityScreenModel({
        dashboardHomeStatus: "offline",
        observabilityStatus: "loaded",
        activityEntriesCount: 8
      }).status
    ).toBe("offline");
  });

  it("resolves loading and error from observability", () => {
    expect(
      createRecentActivityScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loading",
        activityEntriesCount: 8
      }).status
    ).toBe("loading");

    expect(
      createRecentActivityScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "error",
        activityEntriesCount: 8
      }).status
    ).toBe("error");
  });

  it("resolves empty without activity entries", () => {
    expect(
      createRecentActivityScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        activityEntriesCount: 0
      }).status
    ).toBe("empty");
  });

  it("returns canonical route and screen identifiers", () => {
    expect(
      createRecentActivityScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        activityEntriesCount: 5
      })
    ).toEqual({
      routeId: "web.route.recentActivity",
      screenId: "web.recentActivity.screen",
      status: "success"
    });
  });
});
