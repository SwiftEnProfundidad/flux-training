import { describe, expect, it } from "vitest";
import type { CrashReport } from "@flux/contracts";
import { CreateCrashReportUseCase } from "./create-crash-report";
import type { CrashReportRepository } from "../domain/crash-report-repository";

class InMemoryCrashReportRepository implements CrashReportRepository {
  records: CrashReport[] = [];

  async save(report: CrashReport): Promise<void> {
    this.records.push(report);
  }

  async listByUserId(userId: string): Promise<CrashReport[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("CreateCrashReportUseCase", () => {
  it("stores crash report", async () => {
    const repository = new InMemoryCrashReportRepository();
    const useCase = new CreateCrashReportUseCase(repository);

    await useCase.execute({
      userId: "user-1",
      source: "web",
      message: "Unhandled error",
      stackTrace: "App.tsx:12",
      severity: "warning",
      occurredAt: "2026-02-27T10:10:00.000Z"
    });

    expect(repository.records).toHaveLength(1);
    expect(repository.records[0]?.message).toBe("Unhandled error");
  });
});
