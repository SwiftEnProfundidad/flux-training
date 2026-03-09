import type { DashboardHomeStatus } from "./dashboard-home-contract";

type TrainingRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error";

type OperationsRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error"
  | "denied"
  | "offline"
  | "empty";

type CreatePlanAssignmentScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  trainingStatus: TrainingRuntimeStatus;
  operationsStatus: OperationsRuntimeStatus;
  hasSelectedPlan: boolean;
  selectedAthletesCount: number;
};

export type PlanAssignmentScreenModel = {
  routeId: "web.route.planAssignment";
  screenId: "web.planAssignment.screen";
  status: DashboardHomeStatus;
  actions: {
    assignSelected: "web.planAssignment.assignSelected";
    assignAtRisk: "web.planAssignment.assignAtRisk";
    clearSelection: "web.planAssignment.clearSelection";
  };
};

function resolvePlanAssignmentStatus(
  input: CreatePlanAssignmentScreenModelInput
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
    input.operationsStatus === "loading" ||
    input.operationsStatus === "queued"
  ) {
    return "loading";
  }

  if (
    input.trainingStatus === "error" ||
    input.trainingStatus === "validation_error" ||
    input.operationsStatus === "error" ||
    input.operationsStatus === "validation_error"
  ) {
    return "error";
  }

  if (input.operationsStatus === "denied") {
    return "denied";
  }

  if (input.operationsStatus === "offline") {
    return "offline";
  }

  if (input.hasSelectedPlan === false || input.selectedAthletesCount === 0) {
    return "empty";
  }

  return "success";
}

export function createPlanAssignmentScreenModel(
  input: CreatePlanAssignmentScreenModelInput
): PlanAssignmentScreenModel {
  return {
    routeId: "web.route.planAssignment",
    screenId: "web.planAssignment.screen",
    status: resolvePlanAssignmentStatus(input),
    actions: {
      assignSelected: "web.planAssignment.assignSelected",
      assignAtRisk: "web.planAssignment.assignAtRisk",
      clearSelection: "web.planAssignment.clearSelection"
    }
  };
}
