import { describe, expect, it } from "vitest";
import { createSupportIncidentsScreenModel } from "./support-incidents-contract";

describe("support incidents contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createSupportIncidentsScreenModel({
        dashboardHomeStatus: "success",
        billingSupportStatus: "loaded",
        incidentsCount: 2
      })
    ).toEqual({
      routeId: "web.route.supportIncidents",
      screenId: "web.supportIncidents.screen",
      status: "success",
      actions: {
        loadData: "web.supportIncidents.loadData",
        resolveSelected: "web.supportIncidents.resolveSelected",
        clearSelection: "web.supportIncidents.clearSelection",
        clearFilters: "web.supportIncidents.clearFilters"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createSupportIncidentsScreenModel({
        dashboardHomeStatus: "offline",
        billingSupportStatus: "loaded",
        incidentsCount: 2
      }).status
    ).toBe("offline");

    expect(
      createSupportIncidentsScreenModel({
        dashboardHomeStatus: "denied",
        billingSupportStatus: "loaded",
        incidentsCount: 2
      }).status
    ).toBe("denied");
  });

  it("maps billing support runtime to incidents status", () => {
    expect(
      createSupportIncidentsScreenModel({
        dashboardHomeStatus: "success",
        billingSupportStatus: "loading",
        incidentsCount: 0
      }).status
    ).toBe("loading");

    expect(
      createSupportIncidentsScreenModel({
        dashboardHomeStatus: "success",
        billingSupportStatus: "validation_error",
        incidentsCount: 1
      }).status
    ).toBe("error");

    expect(
      createSupportIncidentsScreenModel({
        dashboardHomeStatus: "success",
        billingSupportStatus: "empty",
        incidentsCount: 0
      }).status
    ).toBe("empty");
  });
});
