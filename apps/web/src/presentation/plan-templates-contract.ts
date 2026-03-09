import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type TrainingRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error";

type CreatePlanTemplatesScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  trainingStatus: TrainingRuntimeStatus;
  planTemplatesStatus: ModuleRuntimeStatus;
  templatesCount: number;
  hasSelectedTemplate: boolean;
};

export type PlanTemplatesScreenModel = {
  routeId: "web.route.light.planTemplates";
  screenId: "web.light.planTemplates.screen";
  status: DashboardHomeStatus;
  actions: {
    loadTemplates: "web.light.planTemplates.loadTemplates";
    selectTemplate: "web.light.planTemplates.selectTemplate";
    applyTemplate: "web.light.planTemplates.applyTemplate";
    clearSelection: "web.light.planTemplates.clearSelection";
  };
};

function resolvePlanTemplatesStatus(
  input: CreatePlanTemplatesScreenModelInput
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
    input.planTemplatesStatus === "loading" ||
    input.planTemplatesStatus === "queued"
  ) {
    return "loading";
  }

  if (
    input.trainingStatus === "error" ||
    input.trainingStatus === "validation_error" ||
    input.planTemplatesStatus === "error" ||
    input.planTemplatesStatus === "validation_error"
  ) {
    return "error";
  }

  if (input.templatesCount === 0 || input.hasSelectedTemplate === false) {
    return "empty";
  }

  return "success";
}

export function createPlanTemplatesScreenModel(
  input: CreatePlanTemplatesScreenModelInput
): PlanTemplatesScreenModel {
  return {
    routeId: "web.route.light.planTemplates",
    screenId: "web.light.planTemplates.screen",
    status: resolvePlanTemplatesStatus(input),
    actions: {
      loadTemplates: "web.light.planTemplates.loadTemplates",
      selectTemplate: "web.light.planTemplates.selectTemplate",
      applyTemplate: "web.light.planTemplates.applyTemplate",
      clearSelection: "web.light.planTemplates.clearSelection"
    }
  };
}
