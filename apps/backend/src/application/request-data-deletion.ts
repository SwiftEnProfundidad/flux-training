import {
  dataDeletionRequestSchema,
  type DataDeletionRequest
} from "@flux/contracts";
import type { DataDeletionRequestRepository } from "../domain/data-deletion-request-repository";

export class RequestDataDeletionUseCase {
  constructor(
    private readonly repository: DataDeletionRequestRepository,
    private readonly now: () => Date = () => new Date(),
    private readonly retentionDays = 30
  ) {}

  async execute(input: DataDeletionRequest): Promise<DataDeletionRequest> {
    const parsedInput = dataDeletionRequestSchema.parse(input);
    const fallbackRetentionUntil = new Date(
      this.now().getTime() + this.retentionDays * 24 * 60 * 60 * 1000
    ).toISOString();
    const request = dataDeletionRequestSchema.parse({
      ...parsedInput,
      retentionUntil: parsedInput.retentionUntil ?? fallbackRetentionUntil,
      retentionReason:
        parsedInput.retentionReason ?? "gdpr_art_17_verification_window"
    });
    await this.repository.save(request);
    return request;
  }
}
