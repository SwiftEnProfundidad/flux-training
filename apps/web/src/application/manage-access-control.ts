import {
  accessDecisionInputSchema,
  accessDecisionResultSchema,
  deniedAccessAuditInputSchema,
  deniedAccessAuditSchema,
  type AccessDecisionInput,
  type AccessDecisionResult,
  type DeniedAccessAudit,
  type DeniedAccessAuditInput
} from "@flux/contracts";

export interface AccessControlGateway {
  evaluateAccessDecision(input: AccessDecisionInput): Promise<AccessDecisionResult>;
  recordDeniedAccessAudit(input: DeniedAccessAuditInput): Promise<DeniedAccessAudit>;
}

export class ManageAccessControlUseCase {
  constructor(private readonly gateway: AccessControlGateway) {}

  async evaluateAccessDecision(input: AccessDecisionInput): Promise<AccessDecisionResult> {
    const payload = accessDecisionInputSchema.parse(input);
    const result = await this.gateway.evaluateAccessDecision(payload);
    return accessDecisionResultSchema.parse(result);
  }

  async recordDeniedAccessAudit(input: DeniedAccessAuditInput): Promise<DeniedAccessAudit> {
    const payload = deniedAccessAuditInputSchema.parse(input);
    const result = await this.gateway.recordDeniedAccessAudit(payload);
    return deniedAccessAuditSchema.parse(result);
  }
}
