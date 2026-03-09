import {
  dataExportRequestInputSchema,
  dataExportRequestSchema,
  dataDeletionRequestSchema,
  legalConsentSubmissionSchema,
  type DataExportRequest,
  type DataExportRequestInput,
  type DataDeletionRequest,
  type LegalConsentSubmission
} from "@flux/contracts";

export interface LegalGateway {
  submitConsent(input: LegalConsentSubmission): Promise<LegalConsentSubmission>;
  requestDataExport(input: DataExportRequestInput): Promise<DataExportRequest>;
  requestDataDeletion(input: DataDeletionRequest): Promise<DataDeletionRequest>;
}

export class ManageLegalUseCase {
  constructor(private readonly gateway: LegalGateway) {}

  async submitConsent(input: LegalConsentSubmission): Promise<LegalConsentSubmission> {
    const consent = legalConsentSubmissionSchema.parse(input);
    return this.gateway.submitConsent(consent);
  }

  async requestDataExport(input: DataExportRequestInput): Promise<DataExportRequest> {
    const request = dataExportRequestInputSchema.parse(input);
    const result = await this.gateway.requestDataExport(request);
    return dataExportRequestSchema.parse(result);
  }

  async requestDataDeletion(input: DataDeletionRequest): Promise<DataDeletionRequest> {
    const request = dataDeletionRequestSchema.parse(input);
    return this.gateway.requestDataDeletion(request);
  }
}
