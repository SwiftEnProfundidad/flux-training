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
  it("saves a valid data deletion request", async () => {
    const repository = new InMemoryDataDeletionRequestRepository();
    const useCase = new RequestDataDeletionUseCase(repository);

    const request = await useCase.execute({
      userId: "demo-user",
      requestedAt: "2026-02-26T11:00:00.000Z",
      reason: "user_request",
      status: "pending"
    });

    expect(request.userId).toBe("demo-user");
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
        status: "pending"
      })
    ).rejects.toThrow();
  });
});
