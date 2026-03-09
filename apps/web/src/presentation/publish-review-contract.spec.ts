import { describe, expect, it } from "vitest";
import { createPublishReviewScreenModel } from "./publish-review-contract";

describe("publish review contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createPublishReviewScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        publishReviewStatus: "loaded",
        hasSelectedPlan: true,
        isChecklistReady: true
      })
    ).toEqual({
      routeId: "web.route.light.publishReview",
      screenId: "web.light.publishReview.screen",
      status: "success",
      actions: {
        previewPlan: "web.light.publishReview.previewPlan",
        runChecklist: "web.light.publishReview.runChecklist",
        publishPlan: "web.light.publishReview.publishPlan",
        clearReview: "web.light.publishReview.clearReview"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createPublishReviewScreenModel({
        dashboardHomeStatus: "offline",
        trainingStatus: "loaded",
        publishReviewStatus: "loaded",
        hasSelectedPlan: true,
        isChecklistReady: true
      }).status
    ).toBe("offline");
  });

  it("maps runtime and review readiness to canonical status", () => {
    expect(
      createPublishReviewScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "validation_error",
        publishReviewStatus: "loaded",
        hasSelectedPlan: true,
        isChecklistReady: true
      }).status
    ).toBe("error");

    expect(
      createPublishReviewScreenModel({
        dashboardHomeStatus: "success",
        trainingStatus: "loaded",
        publishReviewStatus: "loaded",
        hasSelectedPlan: true,
        isChecklistReady: false
      }).status
    ).toBe("empty");
  });
});
