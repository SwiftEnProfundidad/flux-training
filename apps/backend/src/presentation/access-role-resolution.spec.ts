import { describe, expect, it } from "vitest";
import {
  createAccessRoleAssignments,
  parseRequestedAccessRole,
  resolveAssignedAccessRole,
  resolveEffectiveAccessRole
} from "./access-role-resolution";

describe("access-role-resolution", () => {
  it("returns null when requested access role header is empty", () => {
    expect(parseRequestedAccessRole("")).toBeNull();
    expect(parseRequestedAccessRole("   ")).toBeNull();
  });

  it("resolves assigned role using server-side user mappings", () => {
    const assignments = createAccessRoleAssignments(
      "admin-a,admin-b",
      "coach-a,coach-b"
    );

    expect(resolveAssignedAccessRole("admin-a", assignments)).toBe("admin");
    expect(resolveAssignedAccessRole("coach-b", assignments)).toBe("coach");
    expect(resolveAssignedAccessRole("athlete-1", assignments)).toBe("athlete");
  });

  it("defaults to assigned role when no requested role is provided", () => {
    expect(resolveEffectiveAccessRole("coach", null)).toBe("coach");
  });

  it("allows role downscope when requested role has lower privileges", () => {
    expect(resolveEffectiveAccessRole("admin", "coach")).toBe("coach");
    expect(resolveEffectiveAccessRole("coach", "athlete")).toBe("athlete");
  });

  it("rejects role escalation when requested role exceeds assigned role", () => {
    expect(() => resolveEffectiveAccessRole("athlete", "coach")).toThrowError(
      "role_escalation_denied"
    );
    expect(() => resolveEffectiveAccessRole("coach", "admin")).toThrowError(
      "role_escalation_denied"
    );
  });
});
