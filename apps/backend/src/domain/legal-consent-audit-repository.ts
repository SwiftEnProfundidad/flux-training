import type { LegalConsentAudit } from "@flux/contracts";

export interface LegalConsentAuditRepository {
  save(entry: LegalConsentAudit): Promise<void>;
}
