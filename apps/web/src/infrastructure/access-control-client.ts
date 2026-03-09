import type {
  AccessDecisionInput,
  AccessDecisionResult,
  DeniedAccessAudit,
  DeniedAccessAuditInput
} from "@flux/contracts";
import type { AccessControlGateway } from "../application/manage-access-control";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiAccessControlGateway implements AccessControlGateway {
  async evaluateAccessDecision(input: AccessDecisionInput): Promise<AccessDecisionResult> {
    const response = await fetch("/api/evaluateAccessDecision", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(input)
    });

    await assertApiResponse(response, "evaluate_access_decision_failed");
    const payload = (await response.json()) as { decision: AccessDecisionResult };
    return payload.decision;
  }

  async recordDeniedAccessAudit(input: DeniedAccessAuditInput): Promise<DeniedAccessAudit> {
    const response = await fetch("/api/recordDeniedAccessAudit", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(input)
    });

    await assertApiResponse(response, "record_denied_access_audit_failed");
    const payload = (await response.json()) as { audit: DeniedAccessAudit };
    return payload.audit;
  }
}

export const apiAccessControlGateway: AccessControlGateway = new ApiAccessControlGateway();
