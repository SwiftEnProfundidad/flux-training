import { describe, expect, it } from "vitest";
import { createAnalyticsOverviewScreenModel } from "./analytics-overview-contract";

describe("analytics overview contract", () => {
  it("inherits denied and offline from dashboard home", () => {
    expect(
      createAnalyticsOverviewScreenModel({
        dashboardHomeStatus: "denied",
        observabilityStatus: "loaded",
        analyticsEventsCount: 4,
        crashReportsCount: 1
      }).status
    ).toBe("denied");

    expect(
      createAnalyticsOverviewScreenModel({
        dashboardHomeStatus: "offline",
        observabilityStatus: "loaded",
        analyticsEventsCount: 4,
        crashReportsCount: 1
      }).status
    ).toBe("offline");
  });

  it("resolves loading and error from observability", () => {
    expect(
      createAnalyticsOverviewScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loading",
        analyticsEventsCount: 4,
        crashReportsCount: 1
      }).status
    ).toBe("loading");

    expect(
      createAnalyticsOverviewScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "error",
        analyticsEventsCount: 4,
        crashReportsCount: 1
      }).status
    ).toBe("error");
  });

  it("resolves empty without events and crashes", () => {
    expect(
      createAnalyticsOverviewScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        analyticsEventsCount: 0,
        crashReportsCount: 0
      }).status
    ).toBe("empty");
  });

  it("returns canonical ids and actions", () => {
    expect(
      createAnalyticsOverviewScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        analyticsEventsCount: 4,
        crashReportsCount: 1
      })
    ).toEqual({
      routeId: "web.route.analyticsOverview",
      screenId: "web.analyticsOverview.screen",
      status: "success",
      actions: {
        trackEvent: "web.analyticsOverview.trackEvent",
        reportCrash: "web.analyticsOverview.reportCrash",
        loadData: "web.analyticsOverview.loadData"
      }
    });
  });
});
