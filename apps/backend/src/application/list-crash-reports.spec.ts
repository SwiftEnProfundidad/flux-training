import { describe, expect, it } from "vitest";
import type { CrashReport } from "@flux/contracts";
import { ListCrashReportsUseCase } from "./list-crash-reports";
import type { CrashReportRepository } from "../domain/crash-report-repository";

class InMemoryCrashReportRepository implements CrashReportRepository {
  constructor(private readonly records: CrashReport[]) {}

  async save(report: CrashReport): Promise<void> {
    this.records.push(report);
  }

  async listByUserId(userId: string): Promise<CrashReport[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("ListCrashReportsUseCase", () => {
  it("lists crash reports by user", async () => {
    const useCase = new ListCrashReportsUseCase(
      new InMemoryCrashReportRepository([
        {
          userId: "user-1",
          source: "ios",
          message: "Unexpected nil",
          stackTrace: "MainViewModel.swift:42",
          severity: "fatal",
          occurredAt: "2026-02-27T10:00:00.000Z"
        },
        {
          userId: "user-2",
          source: "web",
          message: "Reference error",
          stackTrace: "App.tsx:10",
          severity: "warning",
          occurredAt: "2026-02-27T10:01:00.000Z"
        }
      ])
    );

    const reports = await useCase.execute("user-1");

    expect(reports).toHaveLength(1);
    expect(reports[0]?.severity).toBe("fatal");
  });

  it("throws when user id is empty", async () => {
    const useCase = new ListCrashReportsUseCase(new InMemoryCrashReportRepository([]));

    await expect(useCase.execute("")).rejects.toThrowError("missing_user_id");
  });
});
