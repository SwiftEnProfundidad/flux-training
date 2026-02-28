import {
  dataDeletionRequestSchema,
  legalConsentSubmissionSchema,
  type DataDeletionRequest,
  type LegalConsentSubmission
} from "@flux/contracts";

export interface LegalGateway {
  submitConsent(input: LegalConsentSubmission): Promise<LegalConsentSubmission>;
  requestDataDeletion(input: DataDeletionRequest): Promise<DataDeletionRequest>;
}

export class ManageLegalUseCase {
  constructor(private readonly gateway: LegalGateway) {}

  async submitConsent(input: LegalConsentSubmission): Promise<LegalConsentSubmission> {
    const consent = legalConsentSubmissionSchema.parse(input);
    return this.gateway.submitConsent(consent);
  }

  async requestDataDeletion(input: DataDeletionRequest): Promise<DataDeletionRequest> {
    const request = dataDeletionRequestSchema.parse(input);
    return this.gateway.requestDataDeletion(request);
  }
}
