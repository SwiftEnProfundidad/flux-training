import { describe, expect, it } from "vitest";
import type { LegalConsent, LegalConsentAudit } from "@flux/contracts";
import { RecordLegalConsentUseCase } from "./record-legal-consent";
import type { LegalConsentAuditRepository } from "../domain/legal-consent-audit-repository";
import type { LegalConsentRepository } from "../domain/legal-consent-repository";

class InMemoryLegalConsentRepository implements LegalConsentRepository {
  records: LegalConsent[] = [];

  async save(consent: LegalConsent): Promise<void> {
    this.records.push(consent);
  }
}

class InMemoryLegalConsentAuditRepository implements LegalConsentAuditRepository {
  records: LegalConsentAudit[] = [];

  async save(entry: LegalConsentAudit): Promise<void> {
    this.records.push(entry);
  }
}

describe("RecordLegalConsentUseCase", () => {
  it("saves consent and audit trail when all legal flags are accepted", async () => {
    const repository = new InMemoryLegalConsentRepository();
    const auditRepository = new InMemoryLegalConsentAuditRepository();
    const useCase = new RecordLegalConsentUseCase(
      repository,
      auditRepository,
      () => new Date("2026-02-26T10:00:01.000Z"),
      () => "audit-1"
    );

    const consent = await useCase.execute({
      userId: "demo-user",
      acceptedAt: "2026-02-26T10:00:00.000Z",
      privacyPolicyAccepted: true,
      termsAccepted: true,
      medicalDisclaimerAccepted: true,
      policyVersion: "v1.0",
      locale: "es-ES",
      source: "web"
    });

    expect(consent.userId).toBe("demo-user");
    expect(repository.records).toHaveLength(1);
    expect(auditRepository.records).toEqual([
      {
        auditId: "audit-1",
        userId: "demo-user",
        acceptedAt: "2026-02-26T10:00:00.000Z",
        policyVersion: "v1.0",
        locale: "es-ES",
        source: "web",
        capturedAt: "2026-02-26T10:00:01.000Z"
      }
    ]);
  });

  it("throws when any required legal consent is not accepted", async () => {
    const repository = new InMemoryLegalConsentRepository();
    const useCase = new RecordLegalConsentUseCase(repository);

    await expect(
      useCase.execute({
        userId: "demo-user",
        acceptedAt: "2026-02-26T10:00:00.000Z",
        privacyPolicyAccepted: true,
        termsAccepted: false,
        medicalDisclaimerAccepted: true,
        policyVersion: "v1.0",
        locale: "es-ES",
        source: "web"
      })
    ).rejects.toThrowError("legal_consent_incomplete");
  });
});
