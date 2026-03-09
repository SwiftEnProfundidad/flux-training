import {
  accessDecisionInputSchema,
  accessDecisionResultSchema,
  type AccessDecisionInput,
  type AccessDecisionResult
} from "@flux/contracts";
import { ListRoleCapabilitiesUseCase } from "./list-role-capabilities";

export class EvaluateRoleAccessUseCase {
  constructor(
    private readonly listRoleCapabilitiesUseCase: ListRoleCapabilitiesUseCase = new ListRoleCapabilitiesUseCase()
  ) {}

  execute(inputRaw: AccessDecisionInput): AccessDecisionResult {
    const input = accessDecisionInputSchema.parse(inputRaw);
    const capabilities = this.listRoleCapabilitiesUseCase.execute(input.role);
    const hasDomainAccess = capabilities.allowedDomains.includes(input.domain);

    if (hasDomainAccess === false) {
      return accessDecisionResultSchema.parse({
        role: input.role,
        domain: input.domain,
        action: input.action,
        allowed: false,
        reason: "domain_denied",
        evaluatedAt: new Date().toISOString()
      });
    }

    const permission = capabilities.permissions.find(
      (entry) => entry.domain === input.domain
    );

    if (permission === undefined || permission.actions.includes(input.action) === false) {
      return accessDecisionResultSchema.parse({
        role: input.role,
        domain: input.domain,
        action: input.action,
        allowed: false,
        reason: "action_denied",
        evaluatedAt: new Date().toISOString()
      });
    }

    if (permission.conditions.requiresOwnership && input.context.isOwner === false) {
      return accessDecisionResultSchema.parse({
        role: input.role,
        domain: input.domain,
        action: input.action,
        allowed: false,
        reason: "ownership_required",
        evaluatedAt: new Date().toISOString()
      });
    }

    if (
      permission.conditions.requiresMedicalConsent &&
      input.context.medicalDisclaimerAccepted === false
    ) {
      return accessDecisionResultSchema.parse({
        role: input.role,
        domain: input.domain,
        action: input.action,
        allowed: false,
        reason: "medical_consent_required",
        evaluatedAt: new Date().toISOString()
      });
    }

    return accessDecisionResultSchema.parse({
      role: input.role,
      domain: input.domain,
      action: input.action,
      allowed: true,
      reason: "allowed",
      evaluatedAt: new Date().toISOString()
    });
  }
}
