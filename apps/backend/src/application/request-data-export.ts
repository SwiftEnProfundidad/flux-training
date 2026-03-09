import {
  dataExportRequestInputSchema,
  dataExportRequestSchema,
  type DataExportRequest,
  type DataExportRequestInput
} from "@flux/contracts";
import { randomUUID } from "node:crypto";
import type { DataExportRequestRepository } from "../domain/data-export-request-repository";

export class RequestDataExportUseCase {
  constructor(
    private readonly repository: DataExportRequestRepository,
    private readonly now: () => Date = () => new Date(),
    private readonly generateRequestId: () => string = () => randomUUID(),
    private readonly exportTTLHours = 24
  ) {}

  async execute(input: DataExportRequestInput): Promise<DataExportRequest> {
    const parsedInput = dataExportRequestInputSchema.parse(input);
    const requestedAt = parsedInput.requestedAt ?? this.now().toISOString();
    const requestID = this.generateRequestId();
    const expiresAt = new Date(
      new Date(requestedAt).getTime() + this.exportTTLHours * 60 * 60 * 1000
    ).toISOString();

    const request = dataExportRequestSchema.parse({
      id: requestID,
      userId: parsedInput.userId,
      requestedAt,
      format: parsedInput.format,
      status: "completed",
      downloadUrl: `https://cdn.flux.training/exports/${parsedInput.userId}/${requestID}.${parsedInput.format}`,
      expiresAt
    });

    await this.repository.save(request);
    return request;
  }
}
