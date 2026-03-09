import { describe, expect, it } from "vitest";
import { createAthleteFiltersScreenModel } from "./athlete-filters-contract";

describe("athlete filters contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createAthleteFiltersScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        rowsCount: 8
      })
    ).toEqual({
      routeId: "web.route.athleteFilters",
      screenId: "web.athleteFilters.screen",
      status: "success",
      actions: {
        updateSearch: "web.athleteFilters.updateSearch",
        updateSort: "web.athleteFilters.updateSort"
      }
    });
  });

  it("returns lane secondary route, screen and actions", () => {
    expect(
      createAthleteFiltersScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        rowsCount: 8
      })
    ).toEqual({
      routeId: "web.route.light.athleteFilters",
      screenId: "web.light.athleteFilters.screen",
      status: "success",
      actions: {
        updateSearch: "web.light.athleteFilters.updateSearch",
        updateSort: "web.light.athleteFilters.updateSort"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createAthleteFiltersScreenModel({
        dashboardHomeStatus: "loading",
        operationsStatus: "loaded",
        rowsCount: 8
      }).status
    ).toBe("loading");

    expect(
      createAthleteFiltersScreenModel({
        dashboardHomeStatus: "denied",
        operationsStatus: "loaded",
        rowsCount: 8
      }).status
    ).toBe("denied");
  });

  it("maps operations status and empty rows to canonical state", () => {
    expect(
      createAthleteFiltersScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "validation_error",
        rowsCount: 8
      }).status
    ).toBe("error");

    expect(
      createAthleteFiltersScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        rowsCount: 0
      }).status
    ).toBe("empty");
  });
});
