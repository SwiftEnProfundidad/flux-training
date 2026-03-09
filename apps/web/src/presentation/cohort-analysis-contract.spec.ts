import { describe, expect, it } from "vitest";
import { createCohortAnalysisScreenModel } from "./cohort-analysis-contract";

describe("cohort analysis contract", () => {
  it("inherits loading/offline/denied/error from dashboard home", () => {
    expect(
      createCohortAnalysisScreenModel({
        dashboardHomeStatus: "loading",
        operationsStatus: "loaded",
        cohortSize: 4
      }).status
    ).toBe("loading");

    expect(
      createCohortAnalysisScreenModel({
        dashboardHomeStatus: "offline",
        operationsStatus: "loaded",
        cohortSize: 4
      }).status
    ).toBe("offline");

    expect(
      createCohortAnalysisScreenModel({
        dashboardHomeStatus: "denied",
        operationsStatus: "loaded",
        cohortSize: 4
      }).status
    ).toBe("denied");
  });

  it("maps operations loading and validation error", () => {
    expect(
      createCohortAnalysisScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loading",
        cohortSize: 4
      }).status
    ).toBe("loading");

    expect(
      createCohortAnalysisScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "validation_error",
        cohortSize: 4
      }).status
    ).toBe("error");
  });

  it("returns empty without cohort rows", () => {
    expect(
      createCohortAnalysisScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        cohortSize: 0
      }).status
    ).toBe("empty");
  });

  it("returns canonical ids and action", () => {
    expect(
      createCohortAnalysisScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        cohortSize: 4
      })
    ).toEqual({
      routeId: "web.route.cohortAnalysis",
      screenId: "web.cohortAnalysis.screen",
      status: "success",
      actions: {
        refresh: "web.cohortAnalysis.refresh"
      }
    });
  });
});
