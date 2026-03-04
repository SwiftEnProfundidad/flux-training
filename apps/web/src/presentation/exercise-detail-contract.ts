import type { DashboardHomeStatus } from "./dashboard-home-contract";

type VideoRuntimeStatus = "idle" | "loading" | "loaded" | "error";

type CreateExerciseDetailScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  videoStatus: VideoRuntimeStatus;
  videosCount: number;
  hasSelectedVideo: boolean;
};

export type ExerciseDetailScreenModel = {
  routeId: "web.route.exerciseDetail";
  screenId: "web.exerciseDetail.screen";
  status: DashboardHomeStatus;
  actions: {
    loadDetail: "web.exerciseDetail.loadDetail";
    selectVideo: "web.exerciseDetail.selectVideo";
    clearSelection: "web.exerciseDetail.clearSelection";
    openVideo: "web.exerciseDetail.openVideo";
  };
};

function resolveExerciseDetailStatus(
  input: CreateExerciseDetailScreenModelInput
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

  if (input.videosCount === 0 || input.hasSelectedVideo === false) {
    return "empty";
  }

  return "success";
}

export function createExerciseDetailScreenModel(
  input: CreateExerciseDetailScreenModelInput
): ExerciseDetailScreenModel {
  return {
    routeId: "web.route.exerciseDetail",
    screenId: "web.exerciseDetail.screen",
    status: resolveExerciseDetailStatus(input),
    actions: {
      loadDetail: "web.exerciseDetail.loadDetail",
      selectVideo: "web.exerciseDetail.selectVideo",
      clearSelection: "web.exerciseDetail.clearSelection",
      openVideo: "web.exerciseDetail.openVideo"
    }
  };
}
