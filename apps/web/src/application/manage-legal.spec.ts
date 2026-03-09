import { describe, expect, it } from "vitest";
import type {
  DataDeletionRequest,
  DataExportRequest,
  DataExportRequestInput,
  LegalConsentSubmission
} from "@flux/contracts";
import { ManageLegalUseCase } from "./manage-legal";
import type { LegalGateway } from "./manage-legal";

class InMemoryLegalGateway implements LegalGateway {
  consentRecords: LegalConsentSubmission[] = [];
  exportRecords: DataExportRequestInput[] = [];
  deletionRecords: DataDeletionRequest[] = [];

  async submitConsent(input: LegalConsentSubmission): Promise<LegalConsentSubmission> {
    this.consentRecords.push(input);
    return input;
  }

  async requestDataExport(input: DataExportRequestInput): Promise<DataExportRequest> {
    this.exportRecords.push(input);
    return {
      id: "exp-1",
      userId: input.userId,
      requestedAt: input.requestedAt ?? "2026-02-26T11:00:00.000Z",
      format: input.format,
      status: "completed",
      downloadUrl: `https://cdn.flux.training/exports/${input.userId}/exp-1.${input.format}`,
      expiresAt: "2026-02-27T11:00:00.000Z"
    };
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
      medicalDisclaimerAccepted: true,
      policyVersion: "v1.0",
      locale: "es-ES",
      source: "web"
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
      status: "pending",
      exportRequested: true,
      exportFormat: "json"
    });

    expect(deletionRequest.userId).toBe("demo-user");
    expect(gateway.deletionRecords).toHaveLength(1);
  });

  it("requests data export payload", async () => {
    const gateway = new InMemoryLegalGateway();
    const useCase = new ManageLegalUseCase(gateway);

    const exportRequest = await useCase.requestDataExport({
      userId: "demo-user",
      format: "json"
    });

    expect(exportRequest.userId).toBe("demo-user");
    expect(exportRequest.status).toBe("completed");
    expect(gateway.exportRecords).toHaveLength(1);
  });
});
