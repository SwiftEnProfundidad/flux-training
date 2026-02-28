import {
  legalConsentSubmissionSchema,
  type LegalConsent,
  type LegalConsentSubmission
} from "@flux/contracts";
import type { LegalConsentRepository } from "../domain/legal-consent-repository";

export class RecordLegalConsentUseCase {
  constructor(private readonly repository: LegalConsentRepository) {}

  async execute(input: LegalConsentSubmission): Promise<LegalConsent> {
    if (
      input.privacyPolicyAccepted !== true ||
      input.termsAccepted !== true ||
      input.medicalDisclaimerAccepted !== true
    ) {
      throw new Error("legal_consent_incomplete");
    }

    const consent = legalConsentSubmissionSchema.parse(input);
    await this.repository.save(consent);
    return consent;
  }
}
