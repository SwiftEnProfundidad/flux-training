import { describe, expect, it } from "vitest";
import type { RoleCapabilities } from "@flux/contracts";
import { resolveDomainAccessDecision } from "./role-domain-access";

describe("role domain access", () => {
  it("allows all domain regardless of capabilities status", () => {
    expect(resolveDomainAccessDecision("all", "idle", null)).toBe("allowed");
    expect(resolveDomainAccessDecision("all", "error", null)).toBe("allowed");
  });

  it("returns pending while capabilities are not resolved", () => {
    expect(resolveDomainAccessDecision("training", "idle", null)).toBe("pending");
    expect(resolveDomainAccessDecision("training", "loading", null)).toBe("pending");
  });

  it("returns error when capabilities cannot be loaded", () => {
    expect(resolveDomainAccessDecision("training", "error", null)).toBe("error");
    expect(resolveDomainAccessDecision("training", "loaded", null)).toBe("error");
  });

  it("returns allowed/denied based on capability domains", () => {
    const capabilities: RoleCapabilities = {
      role: "coach",
      allowedDomains: ["all", "training", "nutrition", "progress", "operations"],
      permissions: [
        {
          domain: "training",
          actions: ["view", "create", "update", "approve"],
          conditions: { requiresOwnership: false, requiresMedicalConsent: true }
        }
      ],
      issuedAt: "2026-03-02T14:15:00.000Z"
    };

    expect(resolveDomainAccessDecision("training", "loaded", capabilities)).toBe("allowed");
    expect(resolveDomainAccessDecision("onboarding", "loaded", capabilities)).toBe("denied");
  });
});
