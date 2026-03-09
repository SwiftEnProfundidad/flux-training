import { describe, expect, it } from "vitest";
import { createDailyLogReviewScreenModel } from "./daily-log-review-contract";

describe("daily log review contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createDailyLogReviewScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        filteredLogsCount: 3
      })
    ).toEqual({
      routeId: "web.route.dailyLogReview",
      screenId: "web.dailyLogReview.screen",
      status: "success",
      actions: {
        updateFilters: "web.dailyLogReview.updateFilters",
        updateSort: "web.dailyLogReview.updateSort",
        clearFilters: "web.dailyLogReview.clearFilters"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createDailyLogReviewScreenModel({
        dashboardHomeStatus: "loading",
        nutritionStatus: "loaded",
        filteredLogsCount: 3
      }).status
    ).toBe("loading");

    expect(
      createDailyLogReviewScreenModel({
        dashboardHomeStatus: "offline",
        nutritionStatus: "loaded",
        filteredLogsCount: 3
      }).status
    ).toBe("offline");
  });

  it("maps nutrition runtime and filtered rows to canonical status", () => {
    expect(
      createDailyLogReviewScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "validation_error",
        filteredLogsCount: 3
      }).status
    ).toBe("error");

    expect(
      createDailyLogReviewScreenModel({
        dashboardHomeStatus: "success",
        nutritionStatus: "loaded",
        filteredLogsCount: 0
      }).status
    ).toBe("empty");
  });
});
