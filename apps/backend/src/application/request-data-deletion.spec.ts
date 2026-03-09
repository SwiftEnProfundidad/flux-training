import { describe, expect, it } from "vitest";
import type { DataDeletionRequest } from "@flux/contracts";
import { RequestDataDeletionUseCase } from "./request-data-deletion";
import type { DataDeletionRequestRepository } from "../domain/data-deletion-request-repository";

class InMemoryDataDeletionRequestRepository implements DataDeletionRequestRepository {
  records: DataDeletionRequest[] = [];

  async save(request: DataDeletionRequest): Promise<void> {
    this.records.push(request);
  }
}

describe("RequestDataDeletionUseCase", () => {
  it("saves a valid data deletion request with retention metadata", async () => {
    const repository = new InMemoryDataDeletionRequestRepository();
    const useCase = new RequestDataDeletionUseCase(
      repository,
      () => new Date("2026-03-02T10:00:00.000Z"),
      30
    );

    const request = await useCase.execute({
      userId: "demo-user",
      requestedAt: "2026-02-26T11:00:00.000Z",
      reason: "user_request",
      status: "pending",
      exportRequested: true,
      exportFormat: "json"
    });

    expect(request.userId).toBe("demo-user");
    expect(request.exportRequested).toBe(true);
    expect(request.exportFormat).toBe("json");
    expect(request.retentionReason).toBe("gdpr_art_17_verification_window");
    expect(request.retentionUntil).toBe("2026-04-01T10:00:00.000Z");
    expect(repository.records).toHaveLength(1);
  });

  it("throws when userId is empty", async () => {
    const repository = new InMemoryDataDeletionRequestRepository();
    const useCase = new RequestDataDeletionUseCase(repository);

    await expect(
      useCase.execute({
        userId: "",
        requestedAt: "2026-02-26T11:00:00.000Z",
        reason: "user_request",
        status: "pending",
        exportRequested: true,
        exportFormat: "json"
      })
    ).rejects.toThrow();
  });
});
