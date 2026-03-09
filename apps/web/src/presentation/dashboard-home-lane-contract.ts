import type { WebLane } from "./access-gate-lane-contract";
import {
  resolveDashboardHomeStatus,
  type DashboardHomeScreenModel,
  type DashboardHomeStatus
} from "./dashboard-home-contract";
import type { DashboardDomain } from "./dashboard-domains";
import type { EnterpriseRuntimeState } from "./runtime-states";

type CreateDashboardHomeLaneScreenModelInput = {
  lane: WebLane;
  hasAuthenticatedSession: boolean;
  activeDomain: DashboardDomain;
  activeDomainRuntimeState: EnterpriseRuntimeState;
  visibleModulesCount: number;
};

export type DashboardHomeLaneScreenModel = Omit<DashboardHomeScreenModel, "routeId" | "screenId"> & {
  routeId: "web.route.dashboardHome" | "web.route.light.dashboardHome";
  screenId: "web.dashboardHome.screen" | "web.light.dashboardHome.screen";
};

export function createDashboardHomeLaneScreenModel(
  input: CreateDashboardHomeLaneScreenModelInput
): DashboardHomeLaneScreenModel {
  const status: DashboardHomeStatus = resolveDashboardHomeStatus({
    hasAuthenticatedSession: input.hasAuthenticatedSession,
    activeDomainRuntimeState: input.activeDomainRuntimeState,
    visibleModulesCount: input.visibleModulesCount
  });
  const routeId =
    input.lane === "main" ? "web.route.dashboardHome" : "web.route.light.dashboardHome";
  const screenId =
    input.lane === "main" ? "web.dashboardHome.screen" : "web.light.dashboardHome.screen";
  return {
    routeId,
    screenId,
    activeDomain: input.activeDomain,
    status,
    visibleModulesCount: input.visibleModulesCount
  };
}
