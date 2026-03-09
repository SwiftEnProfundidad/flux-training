import type { DeniedAccessAudit } from "@flux/contracts";

export interface DeniedAccessAuditRepository {
  save(audit: DeniedAccessAudit): Promise<void>;
  listByUserId(userId: string): Promise<DeniedAccessAudit[]>;
}
