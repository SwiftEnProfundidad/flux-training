import { describe, expect, it } from "vitest";
import { createSessionDetailScreenModel } from "./session-detail-contract";

describe("session detail contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createSessionDetailScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        sessionStatus: "loaded",
        sessionsCount: 2,
        hasSelectedSession: true
      })
    ).toEqual({
      routeId: "web.route.sessionDetail",
      screenId: "web.sessionDetail.screen",
      status: "success",
      actions: {
        loadSessions: "web.sessionDetail.loadSessions",
        selectSession: "web.sessionDetail.selectSession",
        clearSelection: "web.sessionDetail.clearSelection",
        openExerciseVideo: "web.sessionDetail.openExerciseVideo"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createSessionDetailScreenModel({
        dashboardHomeStatus: "offline",
        trainingStatus: "loaded",
        sessionStatus: "loaded",
        sessionsCount: 2,
        hasSelectedSession: true
      }).status
    ).toBe("offline");
  });

  it("maps training/session runtime and selected session to canonical status", () => {
    expect(
      createSessionDetailScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "validation_error",
        sessionStatus: "loaded",
        sessionsCount: 2,
        hasSelectedSession: true
      }).status
    ).toBe("error");

    expect(
      createSessionDetailScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        sessionStatus: "loaded",
        sessionsCount: 2,
        hasSelectedSession: false
      }).status
    ).toBe("empty");
  });
});
