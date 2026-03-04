import { describe, expect, it } from "vitest";
import { createDashboardHomeLaneScreenModel } from "./dashboard-home-lane-contract";

describe("dashboard home lane contract", () => {
  it("returns main lane route/screen and success state", () => {
    expect(
      createDashboardHomeLaneScreenModel({
        lane: "main",
        hasAuthenticatedSession: true,
        activeDomain: "all",
        activeDomainRuntimeState: "success",
        visibleModulesCount: 4
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.dashboardHome.screen",
      activeDomain: "all",
      status: "success",
      visibleModulesCount: 4
    });
  });

  it("returns secondary lane route/screen", () => {
    expect(
      createDashboardHomeLaneScreenModel({
        lane: "secondary",
        hasAuthenticatedSession: true,
        activeDomain: "operations",
        activeDomainRuntimeState: "success",
        visibleModulesCount: 2
      }).routeId
    ).toBe("web.route.light.dashboardHome");
  });

  it("maps denied and empty states through shared status resolver", () => {
    expect(
      createDashboardHomeLaneScreenModel({
        lane: "secondary",
        hasAuthenticatedSession: false,
        activeDomain: "all",
        activeDomainRuntimeState: "success",
        visibleModulesCount: 3
      }).status
    ).toBe("denied");

    expect(
      createDashboardHomeLaneScreenModel({
        lane: "secondary",
        hasAuthenticatedSession: true,
        activeDomain: "all",
        activeDomainRuntimeState: "success",
        visibleModulesCount: 0
      }).status
    ).toBe("empty");
  });
});
