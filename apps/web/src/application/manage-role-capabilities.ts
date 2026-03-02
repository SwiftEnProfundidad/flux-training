import {
  accessRoleSchema,
  dashboardDomainSchema,
  roleCapabilitiesSchema,
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
}
