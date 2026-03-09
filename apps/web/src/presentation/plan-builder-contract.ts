import type { DashboardHomeStatus } from "./dashboard-home-contract";

type TrainingRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error";

type CreatePlanBuilderScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  trainingStatus: TrainingRuntimeStatus;
  hasValidationError: boolean;
};

export type PlanBuilderScreenModel = {
  routeId: "web.route.planBuilder";
  screenId: "web.planBuilder.screen";
  status: DashboardHomeStatus;
  actions: {
    updateName: "web.planBuilder.updateName";
    updateWeeks: "web.planBuilder.updateWeeks";
    updateDays: "web.planBuilder.updateDays";
    updateTemplate: "web.planBuilder.updateTemplate";
    createPlan: "web.planBuilder.createPlan";
    loadPlans: "web.planBuilder.loadPlans";
  };
};

function resolvePlanBuilderStatus(input: CreatePlanBuilderScreenModelInput): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.trainingStatus === "loading" || input.trainingStatus === "queued") {
    return "loading";
  }
  if (
    input.trainingStatus === "error" ||
    input.trainingStatus === "validation_error" ||
    input.hasValidationError
  ) {
    return "error";
  }

  if (input.trainingStatus === "idle") {
    return "empty";
  }

  return "success";
}

export function createPlanBuilderScreenModel(
  input: CreatePlanBuilderScreenModelInput
): PlanBuilderScreenModel {
  return {
    routeId: "web.route.planBuilder",
    screenId: "web.planBuilder.screen",
    status: resolvePlanBuilderStatus(input),
    actions: {
      updateName: "web.planBuilder.updateName",
      updateWeeks: "web.planBuilder.updateWeeks",
      updateDays: "web.planBuilder.updateDays",
      updateTemplate: "web.planBuilder.updateTemplate",
      createPlan: "web.planBuilder.createPlan",
      loadPlans: "web.planBuilder.loadPlans"
    }
  };
}
