import { describe, expect, it } from "vitest";
import { createBillingOverviewScreenModel } from "./billing-overview-contract";

describe("billing overview contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createBillingOverviewScreenModel({
        dashboardHomeStatus: "success",
        billingSupportStatus: "loaded",
        invoicesCount: 2,
        incidentsCount: 1
      })
    ).toEqual({
      routeId: "web.route.billingOverview",
      screenId: "web.billingOverview.screen",
      status: "success",
      actions: {
        loadData: "web.billingOverview.loadData",
        resolveSelected: "web.billingOverview.resolveSelected",
        clearSelection: "web.billingOverview.clearSelection",
        clearFilters: "web.billingOverview.clearFilters"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createBillingOverviewScreenModel({
        dashboardHomeStatus: "offline",
        billingSupportStatus: "loaded",
        invoicesCount: 1,
        incidentsCount: 1
      }).status
    ).toBe("offline");

    expect(
      createBillingOverviewScreenModel({
        dashboardHomeStatus: "denied",
        billingSupportStatus: "loaded",
        invoicesCount: 1,
        incidentsCount: 1
      }).status
    ).toBe("denied");
  });

  it("maps billing runtime state to canonical status", () => {
    expect(
      createBillingOverviewScreenModel({
        dashboardHomeStatus: "success",
        billingSupportStatus: "loading",
        invoicesCount: 0,
        incidentsCount: 0
      }).status
    ).toBe("loading");

    expect(
      createBillingOverviewScreenModel({
        dashboardHomeStatus: "success",
        billingSupportStatus: "validation_error",
        invoicesCount: 1,
        incidentsCount: 0
      }).status
    ).toBe("error");

    expect(
      createBillingOverviewScreenModel({
        dashboardHomeStatus: "success",
        billingSupportStatus: "empty",
        invoicesCount: 0,
        incidentsCount: 0
      }).status
    ).toBe("empty");
  });
});
