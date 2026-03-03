import type { DeniedAccessAudit } from "@flux/contracts";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";
import { firestore } from "./firebase-app";

export class FirestoreDeniedAccessAuditRepository implements DeniedAccessAuditRepository {
  async save(audit: DeniedAccessAudit): Promise<void> {
    await firestore.collection("deniedAccessAudits").add(audit);
  }

  async listByUserId(userId: string): Promise<DeniedAccessAudit[]> {
    const snapshot = await firestore
      .collection("deniedAccessAudits")
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map((document) => document.data() as DeniedAccessAudit);
  }
}
