import { describe, expect, it } from "vitest";
import type { DataDeletionRequest, LegalConsentSubmission } from "@flux/contracts";
import { ManageLegalUseCase } from "./manage-legal";
import type { LegalGateway } from "./manage-legal";

class InMemoryLegalGateway implements LegalGateway {
  consentRecords: LegalConsentSubmission[] = [];
  deletionRecords: DataDeletionRequest[] = [];

  async submitConsent(input: LegalConsentSubmission): Promise<LegalConsentSubmission> {
    this.consentRecords.push(input);
    return input;
  }

  async requestDataDeletion(input: DataDeletionRequest): Promise<DataDeletionRequest> {
    this.deletionRecords.push(input);
    return input;
  }
}

describe("ManageLegalUseCase", () => {
  it("submits legal consent payload", async () => {
    const gateway = new InMemoryLegalGateway();
    const useCase = new ManageLegalUseCase(gateway);

    const consent = await useCase.submitConsent({
      userId: "demo-user",
      acceptedAt: "2026-02-26T10:00:00.000Z",
      privacyPolicyAccepted: true,
      termsAccepted: true,
      medicalDisclaimerAccepted: true
    });

    expect(consent.userId).toBe("demo-user");
    expect(gateway.consentRecords).toHaveLength(1);
  });

  it("submits data deletion request payload", async () => {
    const gateway = new InMemoryLegalGateway();
    const useCase = new ManageLegalUseCase(gateway);

    const deletionRequest = await useCase.requestDataDeletion({
      userId: "demo-user",
      requestedAt: "2026-02-26T12:00:00.000Z",
      reason: "remove_account",
      status: "pending"
    });

    expect(deletionRequest.userId).toBe("demo-user");
    expect(gateway.deletionRecords).toHaveLength(1);
  });
});
