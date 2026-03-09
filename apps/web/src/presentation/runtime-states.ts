import type { DashboardDomain } from "./dashboard-domains";

export type EnterpriseRuntimeState =
  | "success"
  | "loading"
  | "empty"
  | "error"
  | "offline"
  | "denied";

export type DomainRuntimeStates = Record<DashboardDomain, EnterpriseRuntimeState>;

const successState: EnterpriseRuntimeState = "success";

export function createInitialDomainRuntimeStates(): DomainRuntimeStates {
  return {
    all: successState,
    onboarding: successState,
    training: successState,
    nutrition: successState,
    progress: successState,
    operations: successState
  };
}

export function resolveActiveDomainRuntimeState(
  activeDomain: DashboardDomain,
  states: DomainRuntimeStates
): EnterpriseRuntimeState {
  if (activeDomain === "all") {
    return successState;
  }
  return states[activeDomain];
}

export function setRuntimeStateForActiveDomain(
  activeDomain: DashboardDomain,
  targetState: EnterpriseRuntimeState,
  states: DomainRuntimeStates
): DomainRuntimeStates {
  if (activeDomain === "all") {
    return states;
  }
  return {
    ...states,
    [activeDomain]: targetState
  };
}

export function resetRuntimeStateForActiveDomain(
  activeDomain: DashboardDomain,
  states: DomainRuntimeStates
): DomainRuntimeStates {
  return setRuntimeStateForActiveDomain(activeDomain, successState, states);
}
