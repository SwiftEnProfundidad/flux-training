import { describe, expect, it } from "vitest";
import { createCompareProgressScreenModel } from "./compare-progress-contract";

describe("compare progress contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createCompareProgressScreenModel({
        dashboardHomeStatus: "success",
        progressStatus: "loaded",
        selectedAthleteCount: 1,
        cohortSize: 3
      })
    ).toEqual({
      routeId: "web.route.compareProgress",
      screenId: "web.compareProgress.screen",
      status: "success",
      actions: {
        loadProgress: "web.compareProgress.loadProgress",
        selectFirstAthlete: "web.compareProgress.selectFirstAthlete",
        openSessionHistory: "web.compareProgress.openSessionHistory"
      }
    });
  });

  it("returns lane secondary route, screen and actions", () => {
    expect(
      createCompareProgressScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        progressStatus: "loaded",
        selectedAthleteCount: 1,
        cohortSize: 3
      })
    ).toEqual({
      routeId: "web.route.light.compareProgress",
      screenId: "web.light.compareProgress.screen",
      status: "success",
      actions: {
        loadProgress: "web.light.compareProgress.loadProgress",
        selectFirstAthlete: "web.light.compareProgress.selectFirstAthlete",
        openSessionHistory: "web.light.compareProgress.openSessionHistory"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createCompareProgressScreenModel({
        dashboardHomeStatus: "loading",
        progressStatus: "loaded",
        selectedAthleteCount: 1,
        cohortSize: 3
      }).status
    ).toBe("loading");

    expect(
      createCompareProgressScreenModel({
        dashboardHomeStatus: "offline",
        progressStatus: "loaded",
        selectedAthleteCount: 1,
        cohortSize: 3
      }).status
    ).toBe("offline");
  });

  it("maps progress runtime and data guards to canonical status", () => {
    expect(
      createCompareProgressScreenModel({
        dashboardHomeStatus: "success",
        progressStatus: "validation_error",
        selectedAthleteCount: 1,
        cohortSize: 3
      }).status
    ).toBe("error");

    expect(
      createCompareProgressScreenModel({
        dashboardHomeStatus: "success",
        progressStatus: "empty",
        selectedAthleteCount: 1,
        cohortSize: 3
      }).status
    ).toBe("empty");

    expect(
      createCompareProgressScreenModel({
        dashboardHomeStatus: "success",
        progressStatus: "loaded",
        selectedAthleteCount: 0,
        cohortSize: 3
      }).status
    ).toBe("empty");
  });
});
