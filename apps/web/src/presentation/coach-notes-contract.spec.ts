import { describe, expect, it } from "vitest";
import { createCoachNotesScreenModel } from "./coach-notes-contract";

describe("coach notes contract", () => {
  it("returns canonical route, screen and actions", () => {
    expect(
      createCoachNotesScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        selectedAthleteCount: 1,
        notesCount: 2
      })
    ).toEqual({
      routeId: "web.route.coachNotes",
      screenId: "web.coachNotes.screen",
      status: "success",
      actions: {
        loadNotes: "web.coachNotes.loadNotes",
        saveFollowUp: "web.coachNotes.saveFollowUp",
        clearSelection: "web.coachNotes.clearSelection"
      }
    });
  });

  it("returns lane secondary route, screen and actions", () => {
    expect(
      createCoachNotesScreenModel({
        lane: "secondary",
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        selectedAthleteCount: 1,
        notesCount: 2
      })
    ).toEqual({
      routeId: "web.route.light.coachNotes",
      screenId: "web.light.coachNotes.screen",
      status: "success",
      actions: {
        loadNotes: "web.light.coachNotes.loadNotes",
        saveFollowUp: "web.light.coachNotes.saveFollowUp",
        clearSelection: "web.light.coachNotes.clearSelection"
      }
    });
  });

  it("propagates dashboard blocking states", () => {
    expect(
      createCoachNotesScreenModel({
        dashboardHomeStatus: "loading",
        operationsStatus: "loaded",
        selectedAthleteCount: 1,
        notesCount: 2
      }).status
    ).toBe("loading");

    expect(
      createCoachNotesScreenModel({
        dashboardHomeStatus: "offline",
        operationsStatus: "loaded",
        selectedAthleteCount: 1,
        notesCount: 2
      }).status
    ).toBe("offline");
  });

  it("maps operations status and selected athlete guards", () => {
    expect(
      createCoachNotesScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "validation_error",
        selectedAthleteCount: 1,
        notesCount: 2
      }).status
    ).toBe("error");

    expect(
      createCoachNotesScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        selectedAthleteCount: 0,
        notesCount: 2
      }).status
    ).toBe("empty");

    expect(
      createCoachNotesScreenModel({
        dashboardHomeStatus: "success",
        operationsStatus: "loaded",
        selectedAthleteCount: 1,
        notesCount: 0
      }).status
    ).toBe("empty");
  });
});
