import { describe, expect, it } from "vitest";
import { createProgressTrendsScreenModel } from "./progress-trends-contract";

describe("progress trends contract", () => {
  it("inherits loading/offline/denied/error from dashboard home", () => {
    expect(
      createProgressTrendsScreenModel({
        dashboardHomeStatus: "loading",
        progressStatus: "loaded",
        historyCount: 4
      }).status
    ).toBe("loading");

    expect(
      createProgressTrendsScreenModel({
        dashboardHomeStatus: "offline",
        progressStatus: "loaded",
        historyCount: 4
      }).status
    ).toBe("offline");

    expect(
      createProgressTrendsScreenModel({
        dashboardHomeStatus: "denied",
        progressStatus: "loaded",
        historyCount: 4
      }).status
    ).toBe("denied");
  });

  it("maps progress loading and validation states", () => {
    expect(
      createProgressTrendsScreenModel({
        dashboardHomeStatus: "success",
        progressStatus: "loading",
        historyCount: 4
      }).status
    ).toBe("loading");

    expect(
      createProgressTrendsScreenModel({
        dashboardHomeStatus: "success",
        progressStatus: "validation_error",
        historyCount: 4
      }).status
    ).toBe("error");
  });

  it("returns empty when history is missing", () => {
    expect(
      createProgressTrendsScreenModel({
        dashboardHomeStatus: "success",
        progressStatus: "loaded",
        historyCount: 0
      }).status
    ).toBe("empty");
  });

  it("returns canonical ids and refresh action", () => {
    expect(
      createProgressTrendsScreenModel({
        dashboardHomeStatus: "success",
        progressStatus: "loaded",
        historyCount: 4
      })
    ).toEqual({
      routeId: "web.route.progressTrends",
      screenId: "web.progressTrends.screen",
      status: "success",
      actions: {
        refresh: "web.progressTrends.refresh"
      }
    });
  });
});
