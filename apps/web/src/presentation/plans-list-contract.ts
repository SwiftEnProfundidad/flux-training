import type { DashboardHomeStatus } from "./dashboard-home-contract";

type TrainingRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error";

type CreatePlansListScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  trainingStatus: TrainingRuntimeStatus;
  plansCount: number;
};

export type PlansListScreenModel = {
  routeId: "web.route.plansList";
  screenId: "web.plansList.screen";
  status: DashboardHomeStatus;
  actions: {
    createPlan: "web.plansList.createPlan";
    loadPlans: "web.plansList.loadPlans";
    selectPlan: "web.plansList.selectPlan";
  };
};

function resolvePlansListStatus(input: CreatePlansListScreenModelInput): DashboardHomeStatus {
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
  if (input.trainingStatus === "error" || input.trainingStatus === "validation_error") {
    return "error";
  }
  if (input.plansCount === 0) {
    return "empty";
  }
  return "success";
}

export function createPlansListScreenModel(
  input: CreatePlansListScreenModelInput
): PlansListScreenModel {
  return {
    routeId: "web.route.plansList",
    screenId: "web.plansList.screen",
    status: resolvePlansListStatus(input),
    actions: {
      createPlan: "web.plansList.createPlan",
      loadPlans: "web.plansList.loadPlans",
      selectPlan: "web.plansList.selectPlan"
    }
  };
}
