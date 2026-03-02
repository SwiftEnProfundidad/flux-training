import {
  accessActionSchema,
  accessRoleSchema,
  dashboardDomainSchema,
  roleCapabilitiesSchema,
  type AccessAction,
  type AccessRole,
  type DashboardDomain,
  type RoleCapabilities
} from "@flux/contracts";

export interface RoleCapabilitiesGateway {
  listRoleCapabilities(role: AccessRole): Promise<RoleCapabilities>;
}

export class ManageRoleCapabilitiesUseCase {
  constructor(private readonly gateway: RoleCapabilitiesGateway) {}

  async listRoleCapabilities(roleRaw: string): Promise<RoleCapabilities> {
    const role = accessRoleSchema.parse(roleRaw);
    const capabilities = await this.gateway.listRoleCapabilities(role);
    return roleCapabilitiesSchema.parse(capabilities);
  }

  canAccessDomain(capabilities: RoleCapabilities, domainRaw: string): boolean {
    const domain = dashboardDomainSchema.parse(domainRaw) as DashboardDomain;
    return capabilities.allowedDomains.includes(domain);
  }

  canPerformAction(
    capabilities: RoleCapabilities,
    domainRaw: string,
    actionRaw: string,
    context: { isOwner: boolean; medicalDisclaimerAccepted: boolean }
  ): boolean {
    const domain = dashboardDomainSchema.parse(domainRaw) as DashboardDomain;
    const action = accessActionSchema.parse(actionRaw) as AccessAction;
    const permission = capabilities.permissions.find((entry) => entry.domain === domain);
    if (permission === undefined || permission.actions.includes(action) === false) {
      return false;
    }
    if (permission.conditions.requiresOwnership && context.isOwner === false) {
      return false;
    }
    if (
      permission.conditions.requiresMedicalConsent &&
      context.medicalDisclaimerAccepted === false
    ) {
      return false;
    }
    return true;
  }
}
