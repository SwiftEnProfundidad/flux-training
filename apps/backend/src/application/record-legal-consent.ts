import {
  legalConsentAuditSchema,
  legalConsentSubmissionSchema,
  type LegalConsentAudit,
  type LegalConsent,
  type LegalConsentSubmission
} from "@flux/contracts";
import { randomUUID } from "node:crypto";
import type { LegalConsentAuditRepository } from "../domain/legal-consent-audit-repository";
import type { LegalConsentRepository } from "../domain/legal-consent-repository";

class NoopLegalConsentAuditRepository implements LegalConsentAuditRepository {
  async save(): Promise<void> {}
}

export class RecordLegalConsentUseCase {
  constructor(
    private readonly repository: LegalConsentRepository,
    private readonly auditRepository: LegalConsentAuditRepository = new NoopLegalConsentAuditRepository(),
    private readonly now: () => Date = () => new Date(),
    private readonly generateAuditId: () => string = () => randomUUID()
  ) {}

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
    const auditEntry: LegalConsentAudit = legalConsentAuditSchema.parse({
      auditId: this.generateAuditId(),
      userId: consent.userId,
      acceptedAt: consent.acceptedAt,
      policyVersion: consent.policyVersion,
      locale: consent.locale,
      source: consent.source,
      capturedAt: this.now().toISOString()
    });
    await this.auditRepository.save(auditEntry);
    return consent;
  }
}
