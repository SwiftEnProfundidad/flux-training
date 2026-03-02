import {
  accessRoleSchema,
  roleCapabilitiesSchema,
  type AccessRole,
  type DashboardDomain,
  type RoleCapabilities
} from "@flux/contracts";

const roleDomainMap: Record<AccessRole, DashboardDomain[]> = {
  athlete: ["all", "onboarding", "training", "nutrition", "progress", "operations"],
  coach: ["all", "training", "nutrition", "progress", "operations"],
  admin: ["all", "onboarding", "training", "nutrition", "progress", "operations"]
};

export class ListRoleCapabilitiesUseCase {
  execute(roleRaw: string): RoleCapabilities {
    const role = accessRoleSchema.parse(roleRaw);

    return roleCapabilitiesSchema.parse({
      role,
      allowedDomains: roleDomainMap[role],
      issuedAt: new Date().toISOString()
    });
  }
}
