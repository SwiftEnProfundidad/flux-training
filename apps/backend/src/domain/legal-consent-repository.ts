import type { LegalConsent } from "@flux/contracts";

export interface LegalConsentRepository {
  save(consent: LegalConsent): Promise<void>;
}
