import { describe, expect, it } from "vitest";
import { createDashboardKpisScreenModel } from "./dashboard-kpis-contract";

describe("dashboard kpis contract", () => {
  it("inherits loading/offline/denied/error from dashboard home", () => {
    expect(
      createDashboardKpisScreenModel({
        dashboardHomeStatus: "loading",
        plansCount: 0,
        sessionsCount: 0,
        nutritionLogsCount: 0,
        recommendationsCount: 0,
        openAlertsCount: 0,
        pendingQueueCount: 0
      }).status
    ).toBe("loading");

    expect(
      createDashboardKpisScreenModel({
        dashboardHomeStatus: "error",
        plansCount: 3,
        sessionsCount: 3,
        nutritionLogsCount: 3,
        recommendationsCount: 1,
        openAlertsCount: 1,
        pendingQueueCount: 1
      }).status
    ).toBe("error");
  });

  it("returns empty when all KPI collections are zero", () => {
    expect(
      createDashboardKpisScreenModel({
        dashboardHomeStatus: "success",
        plansCount: 0,
        sessionsCount: 0,
        nutritionLogsCount: 0,
        recommendationsCount: 0,
        openAlertsCount: 0,
        pendingQueueCount: 0
      })
    ).toEqual({
      routeId: "web.route.dashboardKpis",
      screenId: "web.dashboardKpis.screen",
      status: "empty"
    });
  });

  it("returns success when any KPI source has data", () => {
    expect(
      createDashboardKpisScreenModel({
        dashboardHomeStatus: "success",
        plansCount: 1,
        sessionsCount: 0,
        nutritionLogsCount: 0,
        recommendationsCount: 0,
        openAlertsCount: 0,
        pendingQueueCount: 0
      })
    ).toEqual({
      routeId: "web.route.dashboardKpis",
      screenId: "web.dashboardKpis.screen",
      status: "success"
    });
  });
});
