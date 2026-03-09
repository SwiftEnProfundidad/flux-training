import { describe, expect, it } from "vitest";
import { createPlansListScreenModel } from "./plans-list-contract";

describe("plans list contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createPlansListScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        plansCount: 2
      })
    ).toEqual({
      routeId: "web.route.plansList",
      screenId: "web.plansList.screen",
      status: "success",
      actions: {
        createPlan: "web.plansList.createPlan",
        loadPlans: "web.plansList.loadPlans",
        selectPlan: "web.plansList.selectPlan"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createPlansListScreenModel({
        dashboardHomeStatus: "offline",
        trainingStatus: "loaded",
        plansCount: 2
      }).status
    ).toBe("offline");
  });

  it("maps training runtime and plans count to canonical status", () => {
    expect(
      createPlansListScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "validation_error",
        plansCount: 0
      }).status
    ).toBe("error");

    expect(
      createPlansListScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "idle",
        plansCount: 0
      }).status
    ).toBe("empty");
  });
});
