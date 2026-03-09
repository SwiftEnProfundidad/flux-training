import type { DashboardDomain } from "./dashboard-domains";
import type { EnterpriseRuntimeState } from "./runtime-states";

export type DashboardHomeStatus = "loading" | "empty" | "error" | "success" | "denied" | "offline";

type ResolveDashboardHomeStatusInput = {
  hasAuthenticatedSession: boolean;
  activeDomainRuntimeState: EnterpriseRuntimeState;
  visibleModulesCount: number;
};

type CreateDashboardHomeScreenModelInput = ResolveDashboardHomeStatusInput & {
  activeDomain: DashboardDomain;
};

export type DashboardHomeScreenModel = {
  routeId: "web.route.dashboardHome";
  screenId: "web.dashboardHome.screen";
  activeDomain: DashboardDomain;
  status: DashboardHomeStatus;
  visibleModulesCount: number;
};

export function resolveDashboardHomeStatus(
  input: ResolveDashboardHomeStatusInput
): DashboardHomeStatus {
  if (input.hasAuthenticatedSession === false) {
    return "denied";
  }

  if (input.activeDomainRuntimeState === "loading") {
    return "loading";
  }
  if (input.activeDomainRuntimeState === "error") {
    return "error";
  }
  if (input.activeDomainRuntimeState === "offline") {
    return "offline";
  }
  if (input.activeDomainRuntimeState === "denied") {
    return "denied";
  }
  if (input.activeDomainRuntimeState === "empty" || input.visibleModulesCount === 0) {
    return "empty";
  }
  return "success";
}

export function createDashboardHomeScreenModel(
  input: CreateDashboardHomeScreenModelInput
): DashboardHomeScreenModel {
  return {
    routeId: "web.route.dashboardHome",
    screenId: "web.dashboardHome.screen",
    activeDomain: input.activeDomain,
    status: resolveDashboardHomeStatus(input),
    visibleModulesCount: input.visibleModulesCount
  };
}
