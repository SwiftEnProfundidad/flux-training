import { describe, expect, it } from "vitest";
import { createAlertsFullScreenModel } from "./alerts-full-contract";

describe("alerts full contract", () => {
  it("inherits denied and offline from dashboard home", () => {
    expect(
      createAlertsFullScreenModel({
        dashboardHomeStatus: "denied",
        observabilityStatus: "loaded",
        openAlertsCount: 4,
        runbooksCount: 2
      }).status
    ).toBe("denied");

    expect(
      createAlertsFullScreenModel({
        dashboardHomeStatus: "offline",
        observabilityStatus: "loaded",
        openAlertsCount: 4,
        runbooksCount: 2
      }).status
    ).toBe("offline");
  });

  it("resolves loading and error from observability", () => {
    expect(
      createAlertsFullScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loading",
        openAlertsCount: 4,
        runbooksCount: 2
      }).status
    ).toBe("loading");

    expect(
      createAlertsFullScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "error",
        openAlertsCount: 4,
        runbooksCount: 2
      }).status
    ).toBe("error");
  });

  it("resolves empty when there are no alerts and no runbooks", () => {
    expect(
      createAlertsFullScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        openAlertsCount: 0,
        runbooksCount: 0
      }).status
    ).toBe("empty");
  });

  it("returns canonical route and screen identifiers", () => {
    expect(
      createAlertsFullScreenModel({
        dashboardHomeStatus: "success",
        observabilityStatus: "loaded",
        openAlertsCount: 4,
        runbooksCount: 2
      })
    ).toEqual({
      routeId: "web.route.alertsFull",
      screenId: "web.alertsFull.screen",
      status: "success"
    });
  });
});
