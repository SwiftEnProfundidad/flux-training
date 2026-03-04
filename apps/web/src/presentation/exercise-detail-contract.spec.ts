import { describe, expect, it } from "vitest";
import { createExerciseDetailScreenModel } from "./exercise-detail-contract";

describe("exercise detail contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createExerciseDetailScreenModel({
        dashboardHomeStatus: "success",
        videoStatus: "loaded",
        videosCount: 2,
        hasSelectedVideo: true
      })
    ).toEqual({
      routeId: "web.route.exerciseDetail",
      screenId: "web.exerciseDetail.screen",
      status: "success",
      actions: {
        loadDetail: "web.exerciseDetail.loadDetail",
        selectVideo: "web.exerciseDetail.selectVideo",
        clearSelection: "web.exerciseDetail.clearSelection",
        openVideo: "web.exerciseDetail.openVideo"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createExerciseDetailScreenModel({
        dashboardHomeStatus: "offline",
        videoStatus: "loaded",
        videosCount: 2,
        hasSelectedVideo: true
      }).status
    ).toBe("offline");
  });

  it("maps runtime and selection to canonical status", () => {
    expect(
      createExerciseDetailScreenModel({
        dashboardHomeStatus: "success",
        videoStatus: "error",
        videosCount: 2,
        hasSelectedVideo: true
      }).status
    ).toBe("error");

    expect(
      createExerciseDetailScreenModel({
        dashboardHomeStatus: "success",
        videoStatus: "loaded",
        videosCount: 2,
        hasSelectedVideo: false
      }).status
    ).toBe("empty");
  });
});
