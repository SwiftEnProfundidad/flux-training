import { describe, expect, it } from "vitest";
import { createAlertCenterScreenModel } from "./alert-center-contract";

describe("alert center contract", () => {
  it("inherits denied/offline/loading from dashboard home", () => {
    expect(
      createAlertCenterScreenModel({
        dashboardHomeStatus: "denied",
        observabilityStatus: "loaded",
        openAlertsCount: 3
      }).status
    ).toBe("denied");

    expect(
      createAlertCenterScreenModel({
        dashboardHomeStatus: "offline",
        observabilityStatus: "loaded",
        openAlertsCount: 3
      }).status
    ).toBe("offline");
  });

  it("resolves loading/error from observability", () => {
    expect(
      createAlertCenterScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loading",
        openAlertsCount: 3
      }).status
    ).toBe("loading");

    expect(
      createAlertCenterScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "error",
        openAlertsCount: 3
      }).status
    ).toBe("error");
  });

  it("resolves empty when there are no open alerts", () => {
    expect(
      createAlertCenterScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        openAlertsCount: 0
      }).status
    ).toBe("empty");
  });

  it("returns canonical route/screen identifiers", () => {
    expect(
      createAlertCenterScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        openAlertsCount: 2
      })
    ).toEqual({
      routeId: "web.route.dashboardHome",
      screenId: "web.alertCenter.screen",
      status: "success"
    });
  });
});
