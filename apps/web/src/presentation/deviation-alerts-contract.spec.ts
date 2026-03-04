import { describe, expect, it } from "vitest";
import { createDeviationAlertsScreenModel } from "./deviation-alerts-contract";

describe("deviation alerts contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createDeviationAlertsScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        alertsCount: 2
      })
    ).toEqual({
      routeId: "web.route.deviationAlerts",
      screenId: "web.deviationAlerts.screen",
      status: "success",
      actions: {
        loadAlerts: "web.deviationAlerts.loadAlerts",
        clearFilters: "web.deviationAlerts.clearFilters"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createDeviationAlertsScreenModel({
        dashboardHomeStatus: "offline",
        nutritionStatus: "loaded",
        alertsCount: 1
      }).status
    ).toBe("offline");
  });

  it("maps nutrition runtime and alerts to canonical status", () => {
    expect(
      createDeviationAlertsScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "validation_error",
        alertsCount: 1
      }).status
    ).toBe("error");

    expect(
      createDeviationAlertsScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        alertsCount: 0
      }).status
    ).toBe("empty");
  });
});
