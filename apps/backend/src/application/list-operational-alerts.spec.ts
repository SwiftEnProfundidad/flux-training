import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, CrashReport } from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import { ListObservabilitySummaryUseCase } from "./list-observability-summary";
import { ListSupportIncidentsUseCase } from "./list-support-incidents";
import { ListOperationalAlertsUseCase } from "./list-operational-alerts";

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

describe("ListOperationalAlertsUseCase", () => {
  it("builds operational alerts from summary thresholds and high incident backlog", async () => {
    const analyticsRepository = new InMemoryAnalyticsEventRepository([
      {
        userId: "user-1",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-03T10:00:00.000Z",
        attributes: {
          domain: "operations",
          reason: "domain_denied",
          correlationId: "corr-1",
          canonicalEventName: "custom"
        }
      },
      {
        userId: "user-1",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-03T10:02:00.000Z",
        attributes: {
          domain: "operations",
          reason: "domain_denied",
          correlationId: "corr-1",
          canonicalEventName: "custom"
        }
      },
      {
        userId: "user-1",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-03T10:04:00.000Z",
        attributes: {
          domain: "operations",
          reason: "domain_denied",
          correlationId: "corr-2",
          canonicalEventName: "custom"
        }
      },
      {
        userId: "user-1",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-03T10:04:30.000Z",
        attributes: {
          domain: "operations",
          reason: "domain_denied",
          correlationId: "corr-2",
          canonicalEventName: "custom"
        }
      },
      {
        userId: "user-1",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-03T10:04:45.000Z",
        attributes: {
          domain: "operations",
          reason: "domain_denied",
          correlationId: "corr-2",
          canonicalEventName: "custom"
        }
      },
      {
        userId: "user-1",
        name: "dashboard_domain_access_denied",
        source: "web",
        occurredAt: "2026-03-03T10:05:00.000Z",
        attributes: {
          domain: "training",
          reason: "domain_denied",
          correlationId: "corr-2",
          canonicalEventName: "custom"
        }
      },
      {
        userId: "user-1",
        name: "dashboard_domain_access_denied",
        source: "web",
        occurredAt: "2026-03-03T10:06:00.000Z",
        attributes: {
          domain: "nutrition",
          reason: "domain_denied",
          correlationId: "corr-3",
          canonicalEventName: "custom"
        }
      },
      {
        userId: "user-1",
        name: "dashboard_domain_access_denied",
        source: "web",
        occurredAt: "2026-03-03T10:07:00.000Z",
        attributes: {
          domain: "progress",
          reason: "domain_denied",
          correlationId: "corr-4",
          canonicalEventName: "custom"
        }
      },
      {
        userId: "user-1",
        name: "telemetry_noise",
        source: "backend",
        occurredAt: "2026-03-03T10:08:00.000Z",
        attributes: {
          correlationId: "corr-5",
          canonicalEventName: "custom"
        }
      },
      {
        userId: "user-1",
        name: "telemetry_noise",
        source: "backend",
        occurredAt: "2026-03-03T10:09:00.000Z",
        attributes: {
          correlationId: "corr-6",
          canonicalEventName: "custom"
        }
      }
    ]);

    const crashRepository = new InMemoryCrashReportRepository([
      {
        userId: "user-1",
        source: "backend",
        message: "Fatal worker crash",
        severity: "fatal",
        correlationId: "corr-fatal",
        occurredAt: "2026-03-03T10:10:00.000Z"
      }
    ]);

    const summaryUseCase = new ListObservabilitySummaryUseCase(
      analyticsRepository,
      crashRepository,
      () => "2026-03-03T10:12:00.000Z"
    );
    const supportIncidentsUseCase = new ListSupportIncidentsUseCase(
      analyticsRepository,
      crashRepository
    );
    const useCase = new ListOperationalAlertsUseCase(summaryUseCase, supportIncidentsUseCase);

    const alerts = await useCase.execute("user-1");

    expect(alerts.length).toBeGreaterThanOrEqual(4);
    expect(alerts[0]?.code).toBe("fatal_crash_slo_breach");
    expect(alerts.some((alert) => alert.code === "denied_access_spike")).toBe(true);
    expect(alerts.some((alert) => alert.code === "high_incident_backlog")).toBe(true);
    expect(alerts.some((alert) => alert.code === "canonical_coverage_drop")).toBe(true);
    expect(alerts.every((alert) => alert.runbookId.startsWith("RB-"))).toBe(true);
  });

  it("returns empty list when thresholds are healthy", async () => {
    const analyticsRepository = new InMemoryAnalyticsEventRepository([
      {
        userId: "user-healthy",
        name: "dashboard_interaction",
        source: "web",
        occurredAt: "2026-03-03T10:00:00.000Z",
        attributes: {
          correlationId: "corr-healthy-1",
          canonicalEventName: "dashboard_interaction"
        }
      }
    ]);
    const crashRepository = new InMemoryCrashReportRepository([]);

    const useCase = new ListOperationalAlertsUseCase(
      new ListObservabilitySummaryUseCase(
        analyticsRepository,
        crashRepository,
        () => "2026-03-03T10:12:00.000Z"
      ),
      new ListSupportIncidentsUseCase(analyticsRepository, crashRepository)
    );

    const alerts = await useCase.execute("user-healthy");

    expect(alerts).toHaveLength(0);
  });

  it("rejects missing user id", async () => {
    const useCase = new ListOperationalAlertsUseCase(
      new ListObservabilitySummaryUseCase(
        new InMemoryAnalyticsEventRepository([]),
        new InMemoryCrashReportRepository([])
      ),
      new ListSupportIncidentsUseCase(
        new InMemoryAnalyticsEventRepository([]),
        new InMemoryCrashReportRepository([])
      )
    );

    await expect(useCase.execute("   ")).rejects.toThrow("missing_user_id");
  });
});
