import { describe, expect, it } from "vitest";
import type { AccessRole, RoleCapabilities } from "@flux/contracts";
import type { RoleCapabilitiesGateway } from "./manage-role-capabilities";
import { ManageRoleCapabilitiesUseCase } from "./manage-role-capabilities";

class InMemoryRoleCapabilitiesGateway implements RoleCapabilitiesGateway {
  async listRoleCapabilities(role: AccessRole): Promise<RoleCapabilities> {
    const byRole: Record<AccessRole, RoleCapabilities> = {
      athlete: {
        role,
        allowedDomains: ["all", "onboarding", "training", "nutrition", "progress", "operations"],
        issuedAt: "2026-03-01T10:00:00.000Z"
      },
      coach: {
        role,
        allowedDomains: ["all", "training", "nutrition", "progress", "operations"],
        issuedAt: "2026-03-01T10:00:00.000Z"
      },
      admin: {
        role,
        allowedDomains: ["all", "onboarding", "training", "nutrition", "progress", "operations"],
        issuedAt: "2026-03-01T10:00:00.000Z"
      }
    };
    return byRole[role];
  }
}

describe("ManageRoleCapabilitiesUseCase", () => {
  it("loads role capabilities and validates access", async () => {
    const useCase = new ManageRoleCapabilitiesUseCase(new InMemoryRoleCapabilitiesGateway());

    const capabilities = await useCase.listRoleCapabilities("coach");

    expect(capabilities.role).toBe("coach");
    expect(useCase.canAccessDomain(capabilities, "training")).toBe(true);
    expect(useCase.canAccessDomain(capabilities, "onboarding")).toBe(false);
  });

  it("rejects invalid role input", async () => {
    const useCase = new ManageRoleCapabilitiesUseCase(new InMemoryRoleCapabilitiesGateway());

    await expect(useCase.listRoleCapabilities("invalid")).rejects.toThrow();
  });
});
