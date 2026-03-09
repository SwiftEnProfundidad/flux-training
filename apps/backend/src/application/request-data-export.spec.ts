import { describe, expect, it } from "vitest";
import type { DataExportRequest } from "@flux/contracts";
import { RequestDataExportUseCase } from "./request-data-export";
import type { DataExportRequestRepository } from "../domain/data-export-request-repository";

class InMemoryDataExportRequestRepository implements DataExportRequestRepository {
  records: DataExportRequest[] = [];

  async save(request: DataExportRequest): Promise<void> {
    this.records.push(request);
  }
}

describe("RequestDataExportUseCase", () => {
  it("creates export package metadata with expiration window", async () => {
    const repository = new InMemoryDataExportRequestRepository();
    const useCase = new RequestDataExportUseCase(
      repository,
      () => new Date("2026-03-02T10:00:00.000Z"),
      () => "exp-1",
      24
    );

    const request = await useCase.execute({
      userId: "demo-user",
      format: "csv"
    });

    expect(request.id).toBe("exp-1");
    expect(request.status).toBe("completed");
    expect(request.downloadUrl).toBe(
      "https://cdn.flux.training/exports/demo-user/exp-1.csv"
    );
    expect(request.expiresAt).toBe("2026-03-03T10:00:00.000Z");
    expect(repository.records).toHaveLength(1);
  });
});
