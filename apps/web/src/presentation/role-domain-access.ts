import type { RoleCapabilities } from "@flux/contracts";
import type { DashboardDomain } from "./dashboard-domains";

export type RoleCapabilitiesStatus = "idle" | "loading" | "loaded" | "error";
export type DomainAccessDecision = "allowed" | "pending" | "denied" | "error";

export function resolveDomainAccessDecision(
  domain: DashboardDomain,
  status: RoleCapabilitiesStatus,
  capabilities: RoleCapabilities | null
): DomainAccessDecision {
  if (domain === "all") {
    return "allowed";
  }
  if (status === "loading" || status === "idle") {
    return "pending";
  }
  if (status === "error" || capabilities === null) {
    return "error";
  }
  if (capabilities.allowedDomains.includes(domain)) {
    return "allowed";
  }
  return "denied";
}
