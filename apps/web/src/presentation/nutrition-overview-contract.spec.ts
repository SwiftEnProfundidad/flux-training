import { describe, expect, it } from "vitest";
import { createNutritionOverviewScreenModel } from "./nutrition-overview-contract";

describe("nutrition overview contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createNutritionOverviewScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        logsCount: 3,
        filteredLogsCount: 2
      })
    ).toEqual({
      routeId: "web.route.nutritionOverview",
      screenId: "web.nutritionOverview.screen",
      status: "success",
      actions: {
        saveLog: "web.nutritionOverview.saveLog",
        loadLogs: "web.nutritionOverview.loadLogs",
        clearFilters: "web.nutritionOverview.clearFilters"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createNutritionOverviewScreenModel({
        dashboardHomeStatus: "loading",
        nutritionStatus: "loaded",
        logsCount: 3,
        filteredLogsCount: 2
      }).status
    ).toBe("loading");

    expect(
      createNutritionOverviewScreenModel({
        dashboardHomeStatus: "offline",
        nutritionStatus: "loaded",
        logsCount: 3,
        filteredLogsCount: 2
      }).status
    ).toBe("offline");
  });

  it("maps nutrition runtime and empty data to canonical status", () => {
    expect(
      createNutritionOverviewScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "validation_error",
        logsCount: 3,
        filteredLogsCount: 2
      }).status
    ).toBe("error");

    expect(
      createNutritionOverviewScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        logsCount: 0,
        filteredLogsCount: 0
      }).status
    ).toBe("empty");
  });
});
