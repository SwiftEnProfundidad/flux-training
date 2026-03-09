import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, CrashReport } from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import { ListObservabilitySummaryUseCase } from "./list-observability-summary";

class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
  constructor(private readonly records: AnalyticsEvent[]) {}

  async save(): Promise<void> {}

  async listByUserId(userId: string): Promise<AnalyticsEvent[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryCrashReportRepository implements CrashReportRepository {
  constructor(private readonly records: CrashReport[]) {}

  async save(): Promise<void> {}

  async listByUserId(userId: string): Promise<CrashReport[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("ListObservabilitySummaryUseCase", () => {
  it("builds observability summary for a user", async () => {
    const analyticsRepository = new InMemoryAnalyticsEventRepository([
      {
        userId: "user-1",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-03T10:00:00.000Z",
        attributes: {
          correlationId: "corr-1",
          canonicalEventName: "dashboard_action_blocked"
        }
      },
      {
        userId: "user-1",
        name: "dashboard_domain_access_denied",
        source: "ios",
        occurredAt: "2026-03-03T10:05:00.000Z",
        attributes: {
          correlationId: "corr-2",
          canonicalEventName: "dashboard_domain_access_denied"
        }
      },
      {
        userId: "user-1",
        name: "screen_view",
        source: "backend",
        occurredAt: "2026-03-03T10:10:00.000Z",
        attributes: {
          correlationId: "corr-2",
          canonicalEventName: "custom"
        }
      }
    ]);
    const crashRepository = new InMemoryCrashReportRepository([
      {
        userId: "user-1",
        source: "backend",
        message: "fatal crash",
        severity: "fatal",
        occurredAt: "2026-03-03T10:15:00.000Z"
      },
      {
        userId: "user-1",
        source: "ios",
        message: "warning crash",
        severity: "warning",
        occurredAt: "2026-03-03T10:12:00.000Z"
      }
    ]);

    const useCase = new ListObservabilitySummaryUseCase(
      analyticsRepository,
      crashRepository,
      () => "2026-03-03T10:20:00.000Z"
    );

    const summary = await useCase.execute("user-1");

    expect(summary.totalAnalyticsEvents).toBe(3);
    expect(summary.totalCrashReports).toBe(2);
    expect(summary.blockedActions).toBe(1);
    expect(summary.deniedAccessEvents).toBe(1);
    expect(summary.fatalCrashReports).toBe(1);
    expect(summary.uniqueCorrelationIds).toBe(2);
    expect(summary.sourceBreakdown.web).toBe(1);
    expect(summary.sourceBreakdown.ios).toBe(1);
    expect(summary.sourceBreakdown.backend).toBe(1);
    expect(summary.canonicalCoverage.trackedCanonicalEvents).toBe(2);
    expect(summary.canonicalCoverage.customEvents).toBe(1);
    expect(summary.latestAnalyticsAt).toBe("2026-03-03T10:10:00.000Z");
    expect(summary.latestCrashAt).toBe("2026-03-03T10:15:00.000Z");
  });

  it("rejects missing user id", async () => {
    const useCase = new ListObservabilitySummaryUseCase(
      new InMemoryAnalyticsEventRepository([]),
      new InMemoryCrashReportRepository([])
    );

    await expect(useCase.execute("")).rejects.toThrow("missing_user_id");
  });
});
