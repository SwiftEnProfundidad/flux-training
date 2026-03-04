import type { DashboardHomeStatus } from "./dashboard-home-contract";
import type { ModuleRuntimeStatus } from "./module-runtime-status";

type CreateBillingOverviewScreenModelInput = {
  dashboardHomeStatus: DashboardHomeStatus;
  billingSupportStatus: ModuleRuntimeStatus;
  invoicesCount: number;
  incidentsCount: number;
};

export type BillingOverviewScreenModel = {
  routeId: "web.route.billingOverview";
  screenId: "web.billingOverview.screen";
  status: DashboardHomeStatus;
  actions: {
    loadData: "web.billingOverview.loadData";
    resolveSelected: "web.billingOverview.resolveSelected";
    clearSelection: "web.billingOverview.clearSelection";
    clearFilters: "web.billingOverview.clearFilters";
  };
};

function resolveBillingOverviewStatus(
  input: CreateBillingOverviewScreenModelInput
): DashboardHomeStatus {
  if (
    input.dashboardHomeStatus === "loading" ||
    input.dashboardHomeStatus === "offline" ||
    input.dashboardHomeStatus === "denied" ||
    input.dashboardHomeStatus === "error"
  ) {
    return input.dashboardHomeStatus;
  }

  if (input.billingSupportStatus === "loading" || input.billingSupportStatus === "queued") {
    return "loading";
  }
  if (input.billingSupportStatus === "offline") {
    return "offline";
  }
  if (input.billingSupportStatus === "denied") {
    return "denied";
  }
  if (
    input.billingSupportStatus === "error" ||
    input.billingSupportStatus === "validation_error"
  ) {
    return "error";
  }
  if (
    input.billingSupportStatus === "empty" ||
    (input.invoicesCount === 0 && input.incidentsCount === 0)
  ) {
    return "empty";
  }
  return "success";
}

export function createBillingOverviewScreenModel(
  input: CreateBillingOverviewScreenModelInput
): BillingOverviewScreenModel {
  return {
    routeId: "web.route.billingOverview",
    screenId: "web.billingOverview.screen",
    status: resolveBillingOverviewStatus(input),
    actions: {
      loadData: "web.billingOverview.loadData",
      resolveSelected: "web.billingOverview.resolveSelected",
      clearSelection: "web.billingOverview.clearSelection",
      clearFilters: "web.billingOverview.clearFilters"
    }
  };
}
