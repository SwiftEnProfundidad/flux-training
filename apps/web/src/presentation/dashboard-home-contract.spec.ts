import { describe, expect, it } from "vitest";
import {
  createDashboardHomeScreenModel,
  resolveDashboardHomeStatus
} from "./dashboard-home-contract";

describe("dashboard home contract", () => {
  it("resolves denied when session is missing", () => {
    expect(
      resolveDashboardHomeStatus({
        hasAuthenticatedSession: false,
        activeDomainRuntimeState: "success",
        visibleModulesCount: 4
      })
    ).toBe("denied");
  });

  it("maps runtime states to dashboard home states", () => {
    expect(
      resolveDashboardHomeStatus({
        hasAuthenticatedSession: true,
        activeDomainRuntimeState: "loading",
        visibleModulesCount: 4
      })
    ).toBe("loading");

    expect(
      resolveDashboardHomeStatus({
        hasAuthenticatedSession: true,
        activeDomainRuntimeState: "error",
        visibleModulesCount: 4
      })
    ).toBe("error");

    expect(
      resolveDashboardHomeStatus({
        hasAuthenticatedSession: true,
        activeDomainRuntimeState: "offline",
        visibleModulesCount: 4
      })
    ).toBe("offline");

    expect(
      resolveDashboardHomeStatus({
        hasAuthenticatedSession: true,
        activeDomainRuntimeState: "denied",
        visibleModulesCount: 4
      })
    ).toBe("denied");

    expect(
      resolveDashboardHomeStatus({
        hasAuthenticatedSession: true,
        activeDomainRuntimeState: "empty",
        visibleModulesCount: 4
      })
    ).toBe("empty");
  });

  it("resolves empty with zero visible modules", () => {
    expect(
      resolveDashboardHomeStatus({
        hasAuthenticatedSession: true,
        activeDomainRuntimeState: "success",
        visibleModulesCount: 0
      })
    ).toBe("empty");
  });

  it("creates a typed screen model with route and status", () => {
    expect(
      createDashboardHomeScreenModel({
        hasAuthenticatedSession: true,
        activeDomain: "operations",
        activeDomainRuntimeState: "success",
        visibleModulesCount: 3
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.dashboardHome.screen",
      activeDomain: "operations",
      status: "success",
      visibleModulesCount: 3
    });
  });
});
