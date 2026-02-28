import type { LegalConsent } from "@flux/contracts";
import type { LegalConsentRepository } from "../domain/legal-consent-repository";
import { firestore } from "./firebase-app";

export class FirestoreLegalConsentRepository implements LegalConsentRepository {
  async save(consent: LegalConsent): Promise<void> {
    await firestore.collection("legalConsents").add(consent);
  }
}
