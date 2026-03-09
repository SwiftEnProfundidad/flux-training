import { describe, expect, it } from "vitest";
import { createAthletesListScreenModel } from "./athletes-list-contract";

describe("athletes list contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createAthletesListScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        rowsCount: 12
      })
    ).toEqual({
      routeId: "web.route.athletesList",
      screenId: "web.athletesList.screen",
      status: "success",
      actions: {
        assignStarterPlan: "web.athletesList.assignStarterPlan",
        clearSelection: "web.athletesList.clearSelection",
        showMoreRows: "web.athletesList.showMoreRows",
        showAllRows: "web.athletesList.showAllRows"
      }
    });
  });

  it("returns lane secondary route, screen and actions", () => {
    expect(
      createAthletesListScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        rowsCount: 3
      })
    ).toEqual({
      routeId: "web.route.light.athletesList",
      screenId: "web.light.athletesList.screen",
      status: "success",
      actions: {
        assignStarterPlan: "web.light.athletesList.assignStarterPlan",
        clearSelection: "web.light.athletesList.clearSelection",
        showMoreRows: "web.light.athletesList.showMoreRows",
        showAllRows: "web.light.athletesList.showAllRows"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createAthletesListScreenModel({
        dashboardHomeStatus: "loading",
        operationsStatus: "loaded",
        rowsCount: 12
      }).status
    ).toBe("loading");

    expect(
      createAthletesListScreenModel({
        dashboardHomeStatus: "offline",
        operationsStatus: "loaded",
        rowsCount: 12
      }).status
    ).toBe("offline");
  });

  it("maps operations runtime states to canonical status", () => {
    expect(
      createAthletesListScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loading",
        rowsCount: 12
      }).status
    ).toBe("loading");

    expect(
      createAthletesListScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "validation_error",
        rowsCount: 12
      }).status
    ).toBe("error");

    expect(
      createAthletesListScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "empty",
        rowsCount: 0
      }).status
    ).toBe("empty");
  });
});
