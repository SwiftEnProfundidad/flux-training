export type DashboardDomain =
  | "all"
  | "onboarding"
  | "training"
  | "nutrition"
  | "progress"
  | "operations";

export type DashboardRole = "athlete" | "coach" | "admin";

export const dashboardDomains: DashboardDomain[] = [
  "all",
  "onboarding",
  "training",
  "nutrition",
  "progress",
  "operations"
];

export const dashboardRoles: DashboardRole[] = ["athlete", "coach", "admin"];

export type DashboardModule =
  | "onboarding"
  | "training"
  | "operationsHub"
  | "adminGovernance"
  | "auditCompliance"
  | "billingSupport"
  | "recommendations"
  | "nutrition"
  | "progress"
  | "settings"
  | "legal"
  | "offlineSync"
  | "observability";

const domainQueryParam = "domain";

const domainModules: Record<DashboardDomain, DashboardModule[]> = {
  all: [
    "onboarding",
    "training",
    "operationsHub",
    "adminGovernance",
    "auditCompliance",
    "billingSupport",
    "recommendations",
    "nutrition",
    "progress",
    "settings",
    "legal",
    "offlineSync",
    "observability"
  ],
  onboarding: ["onboarding"],
  training: ["training"],
  nutrition: ["nutrition"],
  progress: ["progress"],
  operations: [
    "operationsHub",
    "adminGovernance",
    "auditCompliance",
    "billingSupport",
    "recommendations",
    "settings",
    "legal",
    "offlineSync",
    "observability"
  ]
};

function isDashboardDomain(value: string): value is DashboardDomain {
  return dashboardDomains.includes(value as DashboardDomain);
}

function isDashboardRole(value: string): value is DashboardRole {
  return dashboardRoles.includes(value as DashboardRole);
}

export function resolveDashboardDomain(value: string | null | undefined): DashboardDomain {
  if (value !== null && value !== undefined && isDashboardDomain(value)) {
    return value;
  }
  return "all";
}

export function resolveDashboardRole(value: string | null | undefined): DashboardRole {
  if (value !== null && value !== undefined && isDashboardRole(value)) {
    return value;
  }
  return "athlete";
}

export function readDashboardDomainFromURL(urlString: string): DashboardDomain | null {
  try {
    const rawValue = new URL(urlString).searchParams.get(domainQueryParam);
    if (rawValue !== null && isDashboardDomain(rawValue)) {
      return rawValue;
    }
    return null;
  } catch {
    return null;
  }
}

export function applyDashboardDomainToURL(
  urlString: string,
  domain: DashboardDomain
): string {
  try {
    const url = new URL(urlString);
    url.searchParams.set(domainQueryParam, domain);
    return url.toString();
  } catch {
    return urlString;
  }
}

export function getVisibleModules(activeDomain: DashboardDomain): DashboardModule[] {
  return domainModules[activeDomain];
}

export function isModuleVisible(
  module: DashboardModule,
  activeDomain: DashboardDomain
): boolean {
  return domainModules[activeDomain].includes(module);
}
