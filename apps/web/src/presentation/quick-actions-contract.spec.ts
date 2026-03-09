import { describe, expect, it } from "vitest";
import { createQuickActionsScreenModel } from "./quick-actions-contract";

describe("quick actions contract", () => {
  it("inherits denied/offline/loading from dashboard home", () => {
    expect(
      createQuickActionsScreenModel({
        dashboardHomeStatus: "denied",
        trainingStatus: "idle",
        nutritionStatus: "idle",
        progressStatus: "idle",
        recommendationsStatus: "idle",
        syncStatus: "idle"
      }).status
    ).toBe("denied");

    expect(
      createQuickActionsScreenModel({
        dashboardHomeStatus: "offline",
        trainingStatus: "loaded",
        nutritionStatus: "loaded",
        progressStatus: "loaded",
        recommendationsStatus: "loaded",
        syncStatus: "synced"
      }).status
    ).toBe("offline");
  });

  it("resolves loading/error from module statuses", () => {
    expect(
      createQuickActionsScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loading",
        nutritionStatus: "idle",
        progressStatus: "idle",
        recommendationsStatus: "idle",
        syncStatus: "idle"
      }).status
    ).toBe("loading");

    expect(
      createQuickActionsScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "validation_error",
        nutritionStatus: "idle",
        progressStatus: "idle",
        recommendationsStatus: "idle",
        syncStatus: "idle"
      }).status
    ).toBe("error");
  });

  it("resolves empty when there is no loaded/saved/synced data", () => {
    expect(
      createQuickActionsScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "idle",
        nutritionStatus: "empty",
        progressStatus: "idle",
        recommendationsStatus: "empty",
        syncStatus: "idle"
      }).status
    ).toBe("empty");
  });

  it("resolves success with data and exposes canonical route/screen ids", () => {
    expect(
      createQuickActionsScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        nutritionStatus: "loaded",
        progressStatus: "loaded",
        recommendationsStatus: "loaded",
        syncStatus: "synced"
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.quickActions.screen",
      status: "success"
    });
  });
});
