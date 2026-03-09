import { accessRoleSchema, type AccessRole } from "@flux/contracts";

export type AccessRoleAssignments = {
  adminUserIds: Set<string>;
  coachUserIds: Set<string>;
};

const rolePriority: Record<AccessRole, number> = {
  athlete: 0,
  coach: 1,
  admin: 2
};

function parseUserIdSet(rawUserIds: string | undefined): Set<string> {
  return new Set(
    String(rawUserIds ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0)
  );
}

export function createAccessRoleAssignments(
  adminUserIds: string | undefined,
  coachUserIds: string | undefined
): AccessRoleAssignments {
  return {
    adminUserIds: parseUserIdSet(adminUserIds),
    coachUserIds: parseUserIdSet(coachUserIds)
  };
}

export function parseRequestedAccessRole(rawHeader: string): AccessRole | null {
  const normalized = rawHeader.trim();
  if (normalized.length === 0) {
    return null;
  }
  return accessRoleSchema.parse(normalized);
}

export function resolveAssignedAccessRole(
  userIdRaw: string,
  assignments: AccessRoleAssignments
): AccessRole {
  const userId = userIdRaw.trim();
  if (assignments.adminUserIds.has(userId)) {
    return "admin";
  }
  if (assignments.coachUserIds.has(userId)) {
    return "coach";
  }
  return "athlete";
}

export function resolveEffectiveAccessRole(
  assignedRole: AccessRole,
  requestedRole: AccessRole | null
): AccessRole {
  const effectiveRole = requestedRole ?? assignedRole;
  if (rolePriority[effectiveRole] > rolePriority[assignedRole]) {
    throw new Error("role_escalation_denied");
  }
  return effectiveRole;
}
