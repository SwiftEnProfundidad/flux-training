import { describe, expect, it } from "vitest";
import { ListRoleCapabilitiesUseCase } from "./list-role-capabilities";

describe("ListRoleCapabilitiesUseCase", () => {
  it("returns role capabilities for coach", () => {
    const useCase = new ListRoleCapabilitiesUseCase();

    const result = useCase.execute("coach");

    expect(result.role).toBe("coach");
    expect(result.allowedDomains).toEqual([
      "all",
      "training",
      "nutrition",
      "progress",
      "operations"
    ]);
    expect(result.permissions.length).toBeGreaterThan(0);
    expect(result.permissions.find((permission) => permission.domain === "training")?.actions).toContain(
      "approve"
    );
    expect(
      result.permissions.find((permission) => permission.domain === "training")?.conditions
        .requiresMedicalConsent
    ).toBe(true);
  });

  it("rejects invalid role", () => {
    const useCase = new ListRoleCapabilitiesUseCase();

    expect(() => useCase.execute("unknown")).toThrow();
  });
});
