import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, CrashReport } from "@flux/contracts";
import { ListSupportIncidentsUseCase } from "./list-support-incidents";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";

class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
  constructor(private readonly records: AnalyticsEvent[]) {}

  async save(event: AnalyticsEvent): Promise<void> {
    this.records.push(event);
  }

  async listByUserId(userId: string): Promise<AnalyticsEvent[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryCrashReportRepository implements CrashReportRepository {
  constructor(private readonly records: CrashReport[]) {}

  async save(report: CrashReport): Promise<void> {
    this.records.push(report);
  }

  async listByUserId(userId: string): Promise<CrashReport[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("ListSupportIncidentsUseCase", () => {
  it("builds incidents from analytics and crash reports", async () => {
    const useCase = new ListSupportIncidentsUseCase(
      new InMemoryAnalyticsEventRepository([
        {
          userId: "user-1",
          name: "dashboard_action_blocked",
          source: "web",
          occurredAt: "2026-03-02T10:00:00.000Z",
          attributes: {
            reason: "domain_denied",
            domain: "operations",
            correlationId: "corr-1"
          }
        }
      ]),
      new InMemoryCrashReportRepository([
        {
          userId: "user-1",
          source: "backend",
          message: "fatal worker crash",
          stackTrace: "Worker.ts:22",
          correlationId: "corr-crash-1",
          severity: "fatal",
          occurredAt: "2026-03-02T10:05:00.000Z"
        }
      ])
    );

    const incidents = await useCase.execute("user-1");

    expect(incidents).toHaveLength(2);
    expect(incidents[0]?.severity).toBe("high");
    expect(incidents[0]?.correlationId).toBe("corr-crash-1");
    expect(incidents[1]?.source).toBe("analytics");
    expect(incidents[1]?.correlationId).toBe("corr-1");
  });

  it("throws when user id is empty", async () => {
    const useCase = new ListSupportIncidentsUseCase(
      new InMemoryAnalyticsEventRepository([]),
      new InMemoryCrashReportRepository([])
    );

    await expect(useCase.execute("")).rejects.toThrowError("missing_user_id");
  });
});
