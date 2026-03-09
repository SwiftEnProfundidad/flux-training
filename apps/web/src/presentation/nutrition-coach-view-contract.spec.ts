import { describe, expect, it } from "vitest";
import { createNutritionCoachViewScreenModel } from "./nutrition-coach-view-contract";

describe("nutrition coach view contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createNutritionCoachViewScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        logsCount: 6,
        atRiskAthletesCount: 2
      })
    ).toEqual({
      routeId: "web.route.nutritionCoachView",
      screenId: "web.nutritionCoachView.screen",
      status: "success",
      actions: {
        loadCohort: "web.nutritionCoachView.loadCohort",
        focusAtRisk: "web.nutritionCoachView.focusAtRisk",
        openOperations: "web.nutritionCoachView.openOperations"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createNutritionCoachViewScreenModel({
        dashboardHomeStatus: "denied",
        nutritionStatus: "loaded",
        logsCount: 3,
        atRiskAthletesCount: 1
      }).status
    ).toBe("denied");
  });

  it("maps nutrition runtime and logs to canonical status", () => {
    expect(
      createNutritionCoachViewScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "validation_error",
        logsCount: 3,
        atRiskAthletesCount: 1
      }).status
    ).toBe("error");

    expect(
      createNutritionCoachViewScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        logsCount: 0,
        atRiskAthletesCount: 0
      }).status
    ).toBe("empty");
  });
});
