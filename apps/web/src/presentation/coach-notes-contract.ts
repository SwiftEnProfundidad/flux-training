import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";
import type { WebLane } from "./access-gate-lane-contract";

type CreateCoachNotesScreenModelInput = {
  lane?: WebLane;
  dashboardHomeStatus: DashboardHomeStatus;
  operationsStatus: ModuleRuntimeStatus;
  selectedAthleteCount: number;
  notesCount: number;
};

export type CoachNotesScreenModel = {
  routeId: "web.route.coachNotes" | "web.route.light.coachNotes";
  screenId: "web.coachNotes.screen" | "web.light.coachNotes.screen";
  status: DashboardHomeStatus;
  actions: {
    loadNotes: "web.coachNotes.loadNotes" | "web.light.coachNotes.loadNotes";
    saveFollowUp:
      | "web.coachNotes.saveFollowUp"
      | "web.light.coachNotes.saveFollowUp";
    clearSelection:
      | "web.coachNotes.clearSelection"
      | "web.light.coachNotes.clearSelection";
  };
};

function resolveCoachNotesStatus(
  input: CreateCoachNotesScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.operationsStatus === "loading" || input.operationsStatus === "queued") {
    return "loading";
  }
  if (input.operationsStatus === "offline") {
    return "offline";
  }
  if (input.operationsStatus === "denied") {
    return "denied";
  }
  if (
    input.operationsStatus === "error" ||
    input.operationsStatus === "validation_error"
  ) {
    return "error";
  }
  if (input.selectedAthleteCount === 0 || input.notesCount === 0) {
    return "empty";
  }
  return "success";
}

export function createCoachNotesScreenModel(
  input: CreateCoachNotesScreenModelInput
): CoachNotesScreenModel {
  const isMainLane = input.lane !== "secondary";
  return {
    routeId: isMainLane ? "web.route.coachNotes" : "web.route.light.coachNotes",
    screenId: isMainLane ? "web.coachNotes.screen" : "web.light.coachNotes.screen",
    status: resolveCoachNotesStatus(input),
    actions: {
      loadNotes: isMainLane
        ? "web.coachNotes.loadNotes"
        : "web.light.coachNotes.loadNotes",
      saveFollowUp: isMainLane
        ? "web.coachNotes.saveFollowUp"
        : "web.light.coachNotes.saveFollowUp",
      clearSelection: isMainLane
        ? "web.coachNotes.clearSelection"
        : "web.light.coachNotes.clearSelection"
    }
  };
}
