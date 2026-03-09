import type {
  NutritionLog,
  RoleCapabilities,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";
import type { DashboardRole } from "./dashboard-domains";

export type GovernanceRoleFilter = "all" | DashboardRole;

export type GovernancePrincipal = {
  userId: string;
  assignedRole: DashboardRole;
  source: "operator" | "activity";
  plansCount: number;
  sessionsCount: number;
  nutritionLogsCount: number;
};

export type RoleCapabilityCoverage = {
  role: DashboardRole;
  allowedDomainsCount: number;
  allowedDomains: string;
};

type BuildGovernancePrincipalsInput = {
  operatorId: string;
  activeRole: DashboardRole;
  plans: TrainingPlan[];
  sessions: WorkoutSessionInput[];
  nutritionLogs: NutritionLog[];
  assignedRolesByPrincipal: Record<string, DashboardRole>;
};

export function isAdminRole(role: DashboardRole): boolean {
  return role === "admin";
}

export function buildGovernancePrincipals(
  input: BuildGovernancePrincipalsInput
): GovernancePrincipal[] {
  const uniqueUserIds = new Set<string>([input.operatorId]);

  for (const plan of input.plans) {
    uniqueUserIds.add(plan.userId);
  }
  for (const session of input.sessions) {
    uniqueUserIds.add(session.userId);
  }
  for (const log of input.nutritionLogs) {
    uniqueUserIds.add(log.userId);
  }

  return Array.from(uniqueUserIds)
    .map((userId) => {
      const plansCount = input.plans.filter((plan) => plan.userId === userId).length;
      const sessionsCount = input.sessions.filter((session) => session.userId === userId).length;
      const nutritionLogsCount = input.nutritionLogs.filter((log) => log.userId === userId).length;
      const assignedRole =
        input.assignedRolesByPrincipal[userId] ??
        (userId === input.operatorId ? input.activeRole : "athlete");
      const source: GovernancePrincipal["source"] =
        userId === input.operatorId ? "operator" : "activity";
      return {
        userId,
        assignedRole,
        source,
        plansCount,
        sessionsCount,
        nutritionLogsCount
      };
    })
    .sort((left, right) => left.userId.localeCompare(right.userId));
}

export function filterGovernancePrincipals(
  principals: GovernancePrincipal[],
  query: string,
  roleFilter: GovernanceRoleFilter
): GovernancePrincipal[] {
  const normalizedQuery = query.trim().toLowerCase();
  return principals.filter((principal) => {
    const matchesQuery =
      normalizedQuery.length === 0 || principal.userId.toLowerCase().includes(normalizedQuery);
    const matchesRole =
      roleFilter === "all" ? true : principal.assignedRole === roleFilter;
    return matchesQuery && matchesRole;
  });
}

export function buildRoleCapabilityCoverage(
  capabilitiesByRole: Partial<Record<DashboardRole, RoleCapabilities | null>>
): RoleCapabilityCoverage[] {
  const roles: DashboardRole[] = ["athlete", "coach", "admin"];
  return roles.map((role) => {
    const capabilities = capabilitiesByRole[role];
    const allowedDomains = capabilities?.allowedDomains ?? [];
    return {
      role,
      allowedDomainsCount: allowedDomains.length,
      allowedDomains: allowedDomains.join(", ")
    };
  });
}
