import type { AccessRole, RoleCapabilities } from "@flux/contracts";
import type { RoleCapabilitiesGateway } from "../application/manage-role-capabilities";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiRoleCapabilitiesGateway implements RoleCapabilitiesGateway {
  async listRoleCapabilities(role: AccessRole): Promise<RoleCapabilities> {
    const response = await fetch(
      `/api/listRoleCapabilities?role=${encodeURIComponent(role)}`,
      { headers: createApiHeaders() }
    );
    await assertApiResponse(response, "list_role_capabilities_failed");
    const payload = (await response.json()) as { capabilities: RoleCapabilities };
    return payload.capabilities;
  }
}

export const apiRoleCapabilitiesGateway: RoleCapabilitiesGateway =
  new ApiRoleCapabilitiesGateway();
