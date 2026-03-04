import type { DashboardHomeStatus } from "./dashboard-home-contract";

type VideoRuntimeStatus = "idle" | "loading" | "loaded" | "error";

type CreateExerciseLibraryScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  videoStatus: VideoRuntimeStatus;
  videosCount: number;
};

export type ExerciseLibraryScreenModel = {
  routeId: "web.route.exerciseLibrary";
  screenId: "web.exerciseLibrary.screen";
  status: DashboardHomeStatus;
  actions: {
    selectExercise: "web.exerciseLibrary.selectExercise";
    selectLocale: "web.exerciseLibrary.selectLocale";
    loadVideos: "web.exerciseLibrary.loadVideos";
    openVideo: "web.exerciseLibrary.openVideo";
  };
};

function resolveExerciseLibraryStatus(
  input: CreateExerciseLibraryScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.videoStatus === "loading") {
    return "loading";
  }

  if (input.videoStatus === "error") {
    return "error";
  }

  if (input.videosCount === 0) {
    return "empty";
  }

  return "success";
}

export function createExerciseLibraryScreenModel(
  input: CreateExerciseLibraryScreenModelInput
): ExerciseLibraryScreenModel {
  return {
    routeId: "web.route.exerciseLibrary",
    screenId: "web.exerciseLibrary.screen",
    status: resolveExerciseLibraryStatus(input),
    actions: {
      selectExercise: "web.exerciseLibrary.selectExercise",
      selectLocale: "web.exerciseLibrary.selectLocale",
      loadVideos: "web.exerciseLibrary.loadVideos",
      openVideo: "web.exerciseLibrary.openVideo"
    }
  };
}
