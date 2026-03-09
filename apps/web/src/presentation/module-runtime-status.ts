import type { EnterpriseRuntimeState } from "./runtime-states";
import type { DashboardDomain } from "./dashboard-domains";

export type ModuleRuntimeStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "validation_error"
  | "error"
  | "empty"
  | "offline"
  | "denied";

type DeriveModuleRuntimeStatusInput = {
  activeDomain: DashboardDomain;
  moduleDomain: DashboardDomain;
  activeDomainRuntimeState: EnterpriseRuntimeState;
  hasValidationError: boolean;
  totalItems: number;
  filteredItems: number;
  currentStatus: ModuleRuntimeStatus;
};

export function deriveModuleRuntimeStatus(
  input: DeriveModuleRuntimeStatusInput
): ModuleRuntimeStatus {
  const {
    activeDomain,
    moduleDomain,
    activeDomainRuntimeState,
    hasValidationError,
    totalItems,
    filteredItems,
    currentStatus
  } = input;

  if (activeDomain === moduleDomain) {
    if (activeDomainRuntimeState === "denied") {
      return "denied";
    }
    if (activeDomainRuntimeState === "offline") {
      return "offline";
    }
    if (activeDomainRuntimeState === "error") {
      return "error";
    }
  }

  if (hasValidationError) {
    return "validation_error";
  }

  if (currentStatus === "loading" || currentStatus === "queued") {
    return currentStatus;
  }

  if (totalItems === 0 || filteredItems === 0) {
    return "empty";
  }

  if (currentStatus === "saved") {
    return "saved";
  }

  return "loaded";
}
