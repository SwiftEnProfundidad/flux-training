import { describe, expect, it } from "vitest";
import type {
  AccessDecisionInput,
  AccessDecisionResult,
  DeniedAccessAudit,
  DeniedAccessAuditInput
} from "@flux/contracts";
import {
  type AccessControlGateway,
  ManageAccessControlUseCase
} from "./manage-access-control";

class InMemoryAccessControlGateway implements AccessControlGateway {
  async evaluateAccessDecision(input: AccessDecisionInput): Promise<AccessDecisionResult> {
    const deniedByDomain = input.role === "coach" && input.domain === "onboarding";
    if (deniedByDomain) {
      return {
        role: input.role,
        domain: input.domain,
        action: input.action,
        allowed: false,
        reason: "domain_denied",
        evaluatedAt: "2026-03-03T10:00:00.000Z"
      };
    }
    if (
      input.role === "athlete" &&
      input.domain === "training" &&
      input.context.medicalDisclaimerAccepted === false
    ) {
      return {
        role: input.role,
        domain: input.domain,
        action: input.action,
        allowed: false,
        reason: "medical_consent_required",
        evaluatedAt: "2026-03-03T10:00:00.000Z"
      };
    }
    return {
      role: input.role,
      domain: input.domain,
      action: input.action,
      allowed: true,
      reason: "allowed",
      evaluatedAt: "2026-03-03T10:00:00.000Z"
    };
  }

  async recordDeniedAccessAudit(input: DeniedAccessAuditInput): Promise<DeniedAccessAudit> {
    return {
      id: "audit-1",
      ...input,
      occurredAt: "2026-03-03T10:05:00.000Z"
    };
  }
}

describe("ManageAccessControlUseCase", () => {
  it("evaluates access decisions with conditional policy", async () => {
    const useCase = new ManageAccessControlUseCase(new InMemoryAccessControlGateway());

    const result = await useCase.evaluateAccessDecision({
      role: "athlete",
      domain: "training",
      action: "view",
      context: {
        isOwner: true,
        medicalDisclaimerAccepted: false
      }
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("medical_consent_required");
  });

  it("records denied access audit entries", async () => {
    const useCase = new ManageAccessControlUseCase(new InMemoryAccessControlGateway());

    const audit = await useCase.recordDeniedAccessAudit({
      userId: "demo-user",
      role: "coach",
      domain: "onboarding",
      action: "view",
      reason: "domain_denied",
      trigger: "domain_select",
      correlationId: "corr-1"
    });

    expect(audit.id).toBe("audit-1");
    expect(audit.reason).toBe("domain_denied");
  });
});
