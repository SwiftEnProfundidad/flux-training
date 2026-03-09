import { describe, expect, it } from "vitest";
import { createCohortNutritionScreenModel } from "./cohort-nutrition-contract";

describe("cohort nutrition contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createCohortNutritionScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        rowsCount: 3
      })
    ).toEqual({
      routeId: "web.route.light.cohortNutrition",
      screenId: "web.light.cohortNutrition.screen",
      status: "success",
      actions: {
        loadCohort: "web.light.cohortNutrition.loadCohort",
        focusHighestRisk: "web.light.cohortNutrition.focusHighestRisk"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createCohortNutritionScreenModel({
        dashboardHomeStatus: "loading",
        nutritionStatus: "loaded",
        rowsCount: 3
      }).status
    ).toBe("loading");
  });

  it("maps nutrition runtime and row count to canonical status", () => {
    expect(
      createCohortNutritionScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "validation_error",
        rowsCount: 3
      }).status
    ).toBe("error");

    expect(
      createCohortNutritionScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        rowsCount: 0
      }).status
    ).toBe("empty");
  });
});
