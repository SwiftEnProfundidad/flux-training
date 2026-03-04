import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type TrainingRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error";

type CreatePublishReviewScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  trainingStatus: TrainingRuntimeStatus;
  publishReviewStatus: ModuleRuntimeStatus;
  hasSelectedPlan: boolean;
  isChecklistReady: boolean;
};

export type PublishReviewScreenModel = {
  routeId: "web.route.light.publishReview";
  screenId: "web.light.publishReview.screen";
  status: DashboardHomeStatus;
  actions: {
    previewPlan: "web.light.publishReview.previewPlan";
    runChecklist: "web.light.publishReview.runChecklist";
    publishPlan: "web.light.publishReview.publishPlan";
    clearReview: "web.light.publishReview.clearReview";
  };
};

function resolvePublishReviewStatus(
  input: CreatePublishReviewScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (
    input.trainingStatus === "loading" ||
    input.trainingStatus === "queued" ||
    input.publishReviewStatus === "loading" ||
    input.publishReviewStatus === "queued"
  ) {
    return "loading";
  }

  if (
    input.trainingStatus === "error" ||
    input.trainingStatus === "validation_error" ||
    input.publishReviewStatus === "error" ||
    input.publishReviewStatus === "validation_error"
  ) {
    return "error";
  }

  if (input.hasSelectedPlan === false || input.isChecklistReady === false) {
    return "empty";
  }

  return "success";
}

export function createPublishReviewScreenModel(
  input: CreatePublishReviewScreenModelInput
): PublishReviewScreenModel {
  return {
    routeId: "web.route.light.publishReview",
    screenId: "web.light.publishReview.screen",
    status: resolvePublishReviewStatus(input),
    actions: {
      previewPlan: "web.light.publishReview.previewPlan",
      runChecklist: "web.light.publishReview.runChecklist",
      publishPlan: "web.light.publishReview.publishPlan",
      clearReview: "web.light.publishReview.clearReview"
    }
  };
}
