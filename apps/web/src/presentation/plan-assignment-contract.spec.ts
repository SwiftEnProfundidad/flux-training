import { describe, expect, it } from "vitest";
import { createPlanAssignmentScreenModel } from "./plan-assignment-contract";

describe("plan assignment contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createPlanAssignmentScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        operationsStatus: "loaded",
        hasSelectedPlan: true,
        selectedAthletesCount: 2
      })
    ).toEqual({
      routeId: "web.route.planAssignment",
      screenId: "web.planAssignment.screen",
      status: "success",
      actions: {
        assignSelected: "web.planAssignment.assignSelected",
        assignAtRisk: "web.planAssignment.assignAtRisk",
        clearSelection: "web.planAssignment.clearSelection"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createPlanAssignmentScreenModel({
        dashboardHomeStatus: "denied",
        trainingStatus: "loaded",
        operationsStatus: "loaded",
        hasSelectedPlan: true,
        selectedAthletesCount: 1
      }).status
    ).toBe("denied");
  });

  it("maps runtime and selection to canonical status", () => {
    expect(
      createPlanAssignmentScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "validation_error",
        operationsStatus: "loaded",
        hasSelectedPlan: true,
        selectedAthletesCount: 1
      }).status
    ).toBe("error");

    expect(
      createPlanAssignmentScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        operationsStatus: "loaded",
        hasSelectedPlan: false,
        selectedAthletesCount: 1
      }).status
    ).toBe("empty");

    expect(
      createPlanAssignmentScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        operationsStatus: "loaded",
        hasSelectedPlan: true,
        selectedAthletesCount: 0
      }).status
    ).toBe("empty");
  });
});
