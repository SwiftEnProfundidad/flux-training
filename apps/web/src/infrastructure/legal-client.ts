import type {
  DataDeletionRequest,
  DataExportRequest,
  DataExportRequestInput,
  LegalConsentSubmission
} from "@flux/contracts";
import type { LegalGateway } from "../application/manage-legal";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiLegalGateway implements LegalGateway {
  async submitConsent(input: LegalConsentSubmission): Promise<LegalConsentSubmission> {
    const response = await fetch("/api/recordLegalConsent", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(input)
    });

    await assertApiResponse(response, "record_legal_consent_failed");
    const payload = (await response.json()) as { consent: LegalConsentSubmission };
    return payload.consent;
  }

  async requestDataExport(input: DataExportRequestInput): Promise<DataExportRequest> {
    const response = await fetch("/api/requestDataExport", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(input)
    });

    await assertApiResponse(response, "request_data_export_failed");
    const payload = (await response.json()) as { request: DataExportRequest };
    return payload.request;
  }

  async requestDataDeletion(input: DataDeletionRequest): Promise<DataDeletionRequest> {
    const response = await fetch("/api/requestDataDeletion", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(input)
    });

    await assertApiResponse(response, "request_data_deletion_failed");
    const payload = (await response.json()) as { request: DataDeletionRequest };
    return payload.request;
  }
}

export const apiLegalGateway: LegalGateway = new ApiLegalGateway();
