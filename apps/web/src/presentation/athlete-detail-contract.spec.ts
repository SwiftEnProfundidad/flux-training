import { describe, expect, it } from "vitest";
import { createAthleteDetailScreenModel } from "./athlete-detail-contract";

describe("athlete detail contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createAthleteDetailScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        selectedAthleteCount: 1
      })
    ).toEqual({
      routeId: "web.route.athleteDetail",
      screenId: "web.athleteDetail.screen",
      status: "success",
      actions: {
        selectFirstAthlete: "web.athleteDetail.selectFirstAthlete",
        openSessionHistory: "web.athleteDetail.openSessionHistory",
        clearSelection: "web.athleteDetail.clearSelection"
      }
    });
  });

  it("returns lane secondary route, screen and actions", () => {
    expect(
      createAthleteDetailScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        selectedAthleteCount: 1
      })
    ).toEqual({
      routeId: "web.route.light.athleteDetail",
      screenId: "web.light.athleteDetail.screen",
      status: "success",
      actions: {
        selectFirstAthlete: "web.light.athleteDetail.selectFirstAthlete",
        openSessionHistory: "web.light.athleteDetail.openSessionHistory",
        clearSelection: "web.light.athleteDetail.clearSelection"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createAthleteDetailScreenModel({
        dashboardHomeStatus: "loading",
        operationsStatus: "loaded",
        selectedAthleteCount: 1
      }).status
    ).toBe("loading");

    expect(
      createAthleteDetailScreenModel({
        dashboardHomeStatus: "offline",
        operationsStatus: "loaded",
        selectedAthleteCount: 1
      }).status
    ).toBe("offline");
  });

  it("maps operations status and selected athlete to canonical state", () => {
    expect(
      createAthleteDetailScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "validation_error",
        selectedAthleteCount: 1
      }).status
    ).toBe("error");

    expect(
      createAthleteDetailScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        selectedAthleteCount: 0
      }).status
    ).toBe("empty");
  });
});
