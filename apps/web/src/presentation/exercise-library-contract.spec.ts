import { describe, expect, it } from "vitest";
import { createExerciseLibraryScreenModel } from "./exercise-library-contract";

describe("exercise library contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createExerciseLibraryScreenModel({
        dashboardHomeStatus: "success",
        videoStatus: "loaded",
        videosCount: 2
      })
    ).toEqual({
      routeId: "web.route.exerciseLibrary",
      screenId: "web.exerciseLibrary.screen",
      status: "success",
      actions: {
        selectExercise: "web.exerciseLibrary.selectExercise",
        selectLocale: "web.exerciseLibrary.selectLocale",
        loadVideos: "web.exerciseLibrary.loadVideos",
        openVideo: "web.exerciseLibrary.openVideo"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createExerciseLibraryScreenModel({
        dashboardHomeStatus: "offline",
        videoStatus: "loaded",
        videosCount: 2
      }).status
    ).toBe("offline");
  });

  it("maps runtime and rows to canonical status", () => {
    expect(
      createExerciseLibraryScreenModel({
        dashboardHomeStatus: "success",
        videoStatus: "error",
        videosCount: 0
      }).status
    ).toBe("error");

    expect(
      createExerciseLibraryScreenModel({
        dashboardHomeStatus: "success",
        videoStatus: "idle",
        videosCount: 0
      }).status
    ).toBe("empty");
  });
});
