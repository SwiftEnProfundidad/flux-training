import type { LegalConsentAudit } from "@flux/contracts";
import type { LegalConsentAuditRepository } from "../domain/legal-consent-audit-repository";
import { firestore } from "./firebase-app";

export class FirestoreLegalConsentAuditRepository implements LegalConsentAuditRepository {
  async save(entry: LegalConsentAudit): Promise<void> {
    await firestore.collection("legalConsentAudits").add(entry);
  }
}
