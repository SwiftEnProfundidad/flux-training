import {
  dataDeletionRequestSchema,
  type DataDeletionRequest
} from "@flux/contracts";
import type { DataDeletionRequestRepository } from "../domain/data-deletion-request-repository";

export class RequestDataDeletionUseCase {
  constructor(private readonly repository: DataDeletionRequestRepository) {}

  async execute(input: DataDeletionRequest): Promise<DataDeletionRequest> {
    const request = dataDeletionRequestSchema.parse(input);
    await this.repository.save(request);
    return request;
  }
}
