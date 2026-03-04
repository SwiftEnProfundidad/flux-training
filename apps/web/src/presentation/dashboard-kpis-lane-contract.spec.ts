import { describe, expect, it } from "vitest";
import { createDashboardKpisLaneScreenModel } from "./dashboard-kpis-lane-contract";

describe("dashboard kpis lane contract", () => {
  it("maps canonical ids for main lane", () => {
    expect(
      createDashboardKpisLaneScreenModel({
        lane: "main",
        dashboardHomeStatus: "success",
        plansCount: 2,
        sessionsCount: 5,
        nutritionLogsCount: 3,
        recommendationsCount: 2,
        openAlertsCount: 1,
        pendingQueueCount: 0
      })
    ).toEqual({
      routeId: "web.route.dashboardKpis",
      screenId: "web.dashboardKpis.screen",
      status: "success",
      actions: {
        refresh: "web.dashboardKpis.refresh"
      }
    });
  });

  it("maps lane ids for secondary lane", () => {
    expect(
      createDashboardKpisLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        plansCount: 2,
        sessionsCount: 5,
        nutritionLogsCount: 3,
        recommendationsCount: 2,
        openAlertsCount: 1,
        pendingQueueCount: 0
      })
    ).toEqual({
      routeId: "web.route.light.dashboardKpis",
      screenId: "web.light.dashboardKpis.screen",
      status: "success",
      actions: {
        refresh: "web.light.dashboardKpis.refresh"
      }
    });
  });

  it("inherits error status from dashboard model", () => {
    expect(
      createDashboardKpisLaneScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "error",
        plansCount: 2,
        sessionsCount: 5,
        nutritionLogsCount: 3,
        recommendationsCount: 2,
        openAlertsCount: 1,
        pendingQueueCount: 0
      }).status
    ).toBe("error");
  });
});
