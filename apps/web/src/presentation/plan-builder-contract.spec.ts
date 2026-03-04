import { describe, expect, it } from "vitest";
import { createPlanBuilderScreenModel } from "./plan-builder-contract";

describe("plan builder contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createPlanBuilderScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        hasValidationError: false
      })
    ).toEqual({
      routeId: "web.route.planBuilder",
      screenId: "web.planBuilder.screen",
      status: "success",
      actions: {
        updateName: "web.planBuilder.updateName",
        updateWeeks: "web.planBuilder.updateWeeks",
        updateDays: "web.planBuilder.updateDays",
        updateTemplate: "web.planBuilder.updateTemplate",
        createPlan: "web.planBuilder.createPlan",
        loadPlans: "web.planBuilder.loadPlans"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createPlanBuilderScreenModel({
        dashboardHomeStatus: "offline",
        trainingStatus: "loaded",
        hasValidationError: false
      }).status
    ).toBe("offline");
  });

  it("maps training runtime and validation to canonical status", () => {
    expect(
      createPlanBuilderScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "validation_error",
        hasValidationError: false
      }).status
    ).toBe("error");

    expect(
      createPlanBuilderScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        hasValidationError: true
      }).status
    ).toBe("error");

    expect(
      createPlanBuilderScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "idle",
        hasValidationError: false
      }).status
    ).toBe("empty");
  });
});
