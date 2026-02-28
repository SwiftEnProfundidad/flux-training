import { describe, expect, it } from "vitest";
import type { LegalConsent } from "@flux/contracts";
import { RecordLegalConsentUseCase } from "./record-legal-consent";
import type { LegalConsentRepository } from "../domain/legal-consent-repository";

class InMemoryLegalConsentRepository implements LegalConsentRepository {
  records: LegalConsent[] = [];

  async save(consent: LegalConsent): Promise<void> {
    this.records.push(consent);
  }
}

describe("RecordLegalConsentUseCase", () => {
  it("saves consent when all legal flags are accepted", async () => {
    const repository = new InMemoryLegalConsentRepository();
    const useCase = new RecordLegalConsentUseCase(repository);

    const consent = await useCase.execute({
      userId: "demo-user",
      acceptedAt: "2026-02-26T10:00:00.000Z",
      privacyPolicyAccepted: true,
      termsAccepted: true,
      medicalDisclaimerAccepted: true
    });

    expect(consent.userId).toBe("demo-user");
    expect(repository.records).toHaveLength(1);
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
        medicalDisclaimerAccepted: true
      })
    ).rejects.toThrowError("legal_consent_incomplete");
  });
});
