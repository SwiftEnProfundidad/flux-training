import {
  accessActionSchema,
  accessRoleSchema,
  roleCapabilitiesSchema,
  type AccessRole,
  type DashboardDomain,
  type RoleResourcePermission,
  type RoleCapabilities
} from "@flux/contracts";

const rolePermissionsMap: Record<AccessRole, RoleResourcePermission[]> = {
  athlete: [
    {
      domain: "onboarding",
      actions: ["view", "update"],
      conditions: { requiresOwnership: true, requiresMedicalConsent: false }
    },
    {
      domain: "training",
      actions: ["view", "create", "update"],
      conditions: { requiresOwnership: true, requiresMedicalConsent: true }
    },
    {
      domain: "nutrition",
      actions: ["view", "create", "update"],
      conditions: { requiresOwnership: true, requiresMedicalConsent: false }
    },
    {
      domain: "progress",
      actions: ["view", "export"],
      conditions: { requiresOwnership: true, requiresMedicalConsent: false }
    },
    {
      domain: "operations",
      actions: ["view"],
      conditions: { requiresOwnership: true, requiresMedicalConsent: false }
    }
  ],
  coach: [
    {
      domain: "training",
      actions: ["view", "create", "update", "approve"],
      conditions: { requiresOwnership: false, requiresMedicalConsent: true }
    },
    {
      domain: "nutrition",
      actions: ["view", "update", "export"],
      conditions: { requiresOwnership: false, requiresMedicalConsent: false }
    },
    {
      domain: "progress",
      actions: ["view", "export"],
      conditions: { requiresOwnership: false, requiresMedicalConsent: false }
    },
    {
      domain: "operations",
      actions: ["view", "assign"],
      conditions: { requiresOwnership: false, requiresMedicalConsent: false }
    }
  ],
  admin: [
    {
      domain: "onboarding",
      actions: ["view", "create", "update", "delete", "approve"],
      conditions: { requiresOwnership: false, requiresMedicalConsent: false }
    },
    {
      domain: "training",
      actions: ["view", "create", "update", "delete", "approve", "export"],
      conditions: { requiresOwnership: false, requiresMedicalConsent: false }
    },
    {
      domain: "nutrition",
      actions: ["view", "create", "update", "delete", "export"],
      conditions: { requiresOwnership: false, requiresMedicalConsent: false }
    },
    {
      domain: "progress",
      actions: ["view", "export"],
      conditions: { requiresOwnership: false, requiresMedicalConsent: false }
    },
    {
      domain: "operations",
      actions: ["view", "create", "update", "delete", "approve", "assign", "export"],
      conditions: { requiresOwnership: false, requiresMedicalConsent: false }
    }
  ]
};

function resolveAllowedDomains(
  permissions: RoleResourcePermission[]
): DashboardDomain[] {
  const domains = new Set<DashboardDomain>(["all"]);
  for (const permission of permissions) {
    domains.add(permission.domain);
    permission.actions.forEach((action) => accessActionSchema.parse(action));
  }
  return Array.from(domains);
}

export class ListRoleCapabilitiesUseCase {
  execute(roleRaw: string): RoleCapabilities {
    const role = accessRoleSchema.parse(roleRaw);
    const permissions = rolePermissionsMap[role];

    return roleCapabilitiesSchema.parse({
      role,
      allowedDomains: resolveAllowedDomains(permissions),
      permissions,
      issuedAt: new Date().toISOString()
    });
  }
}
