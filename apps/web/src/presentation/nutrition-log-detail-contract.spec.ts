import { describe, expect, it } from "vitest";
import { createNutritionLogDetailScreenModel } from "./nutrition-log-detail-contract";

describe("nutrition log detail contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createNutritionLogDetailScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        logsCount: 3,
        hasSelectedLog: true
      })
    ).toEqual({
      routeId: "web.route.light.logDetail",
      screenId: "web.light.logDetail.screen",
      status: "success",
      actions: {
        loadDetail: "web.light.logDetail.loadDetail",
        selectLog: "web.light.logDetail.selectLog",
        clearSelection: "web.light.logDetail.clearSelection",
        openCoachView: "web.light.logDetail.openCoachView"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createNutritionLogDetailScreenModel({
        dashboardHomeStatus: "offline",
        nutritionStatus: "loaded",
        logsCount: 2,
        hasSelectedLog: true
      }).status
    ).toBe("offline");
  });

  it("maps nutrition runtime and selected log to canonical status", () => {
    expect(
      createNutritionLogDetailScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "validation_error",
        logsCount: 2,
        hasSelectedLog: true
      }).status
    ).toBe("error");

    expect(
      createNutritionLogDetailScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        logsCount: 2,
        hasSelectedLog: false
      }).status
    ).toBe("empty");
  });
});
