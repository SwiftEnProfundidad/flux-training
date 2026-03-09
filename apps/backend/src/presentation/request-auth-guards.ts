import {
  accessRoleSchema,
  type AccessDecisionReason,
  type AccessRole,
  type DeniedAccessReason
} from "@flux/contracts";

const BEARER_PREFIX = "bearer ";

export function parseBearerTokenHeader(rawHeader: string): string | null {
  const normalized = rawHeader.trim();
  if (normalized.length === 0) {
    return null;
  }
  const lowercase = normalized.toLowerCase();
  if (lowercase.startsWith(BEARER_PREFIX) === false) {
    return null;
  }
  const token = normalized.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

export function parseAccessRoleHeader(rawHeader: string): AccessRole {
  const normalized = rawHeader.trim();
  if (normalized.length === 0) {
    return "athlete";
  }
  return accessRoleSchema.parse(normalized);
}

export function toDeniedAccessReason(reason: AccessDecisionReason): DeniedAccessReason {
  if (reason === "domain_denied") {
    return "domain_denied";
  }
  if (reason === "ownership_required") {
    return "ownership_required";
  }
  if (reason === "medical_consent_required") {
    return "medical_consent_required";
  }
  return "action_denied";
}
