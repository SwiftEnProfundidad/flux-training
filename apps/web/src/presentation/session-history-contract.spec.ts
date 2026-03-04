import { describe, expect, it } from "vitest";
import { createSessionHistoryScreenModel } from "./session-history-contract";

describe("session history contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createSessionHistoryScreenModel({
        dashboardHomeStatus: "success",
        sessionStatus: "saved",
        selectedAthleteCount: 1,
        rowsCount: 3
      })
    ).toEqual({
      routeId: "web.route.sessionHistory",
      screenId: "web.sessionHistory.screen",
      status: "success",
      actions: {
        loadSessions: "web.sessionHistory.loadSessions",
        selectFirstAthlete: "web.sessionHistory.selectFirstAthlete",
        clearSelection: "web.sessionHistory.clearSelection"
      }
    });
  });

  it("returns lane secondary route, screen and actions", () => {
    expect(
      createSessionHistoryScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        sessionStatus: "saved",
        selectedAthleteCount: 1,
        rowsCount: 3
      })
    ).toEqual({
      routeId: "web.route.light.sessionHistory",
      screenId: "web.light.sessionHistory.screen",
      status: "success",
      actions: {
        loadSessions: "web.light.sessionHistory.loadSessions",
        selectFirstAthlete: "web.light.sessionHistory.selectFirstAthlete",
        clearSelection: "web.light.sessionHistory.clearSelection"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createSessionHistoryScreenModel({
        dashboardHomeStatus: "loading",
        sessionStatus: "saved",
        selectedAthleteCount: 1,
        rowsCount: 3
      }).status
    ).toBe("loading");

    expect(
      createSessionHistoryScreenModel({
        dashboardHomeStatus: "offline",
        sessionStatus: "saved",
        selectedAthleteCount: 1,
        rowsCount: 3
      }).status
    ).toBe("offline");
  });

  it("maps session runtime and selected athlete to canonical status", () => {
    expect(
      createSessionHistoryScreenModel({
        dashboardHomeStatus: "success",
        sessionStatus: "validation_error",
        selectedAthleteCount: 1,
        rowsCount: 3
      }).status
    ).toBe("error");

    expect(
      createSessionHistoryScreenModel({
        dashboardHomeStatus: "success",
        sessionStatus: "idle",
        selectedAthleteCount: 0,
        rowsCount: 0
      }).status
    ).toBe("empty");
  });
});
