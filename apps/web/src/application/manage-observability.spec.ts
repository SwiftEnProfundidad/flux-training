import { describe, expect, it } from "vitest";
import type {
  AnalyticsEvent,
  CrashReport,
  ObservabilitySummary,
  OperationalAlert,
  OperationalRunbook
} from "@flux/contracts";
import type { ObservabilityGateway } from "./manage-observability";
import { ManageObservabilityUseCase } from "./manage-observability";

class InMemoryObservabilityGateway implements ObservabilityGateway {
  private readonly events: AnalyticsEvent[] = [
    {
      userId: "user-1",
      name: "screen_view",
      source: "web" as const,
      occurredAt: "2026-02-27T10:00:00.000Z",
      attributes: { screen: "dashboard" }
    }
  ];

  private readonly reports: CrashReport[] = [
    {
      userId: "user-1",
      source: "web" as const,
      message: "Unhandled error",
      stackTrace: "App.tsx:10",
      severity: "warning" as const,
      occurredAt: "2026-02-27T10:01:00.000Z"
    }
  ];

  async createAnalyticsEvent(event: AnalyticsEvent) {
    this.events.push(event);
    return event;
  }

  async listAnalyticsEvents(userId: string) {
    return this.events.filter((event) => event.userId === userId);
  }

  async createCrashReport(report: CrashReport) {
    this.reports.push(report);
    return report;
  }

  async listCrashReports(userId: string) {
    return this.reports.filter((report) => report.userId === userId);
  }

  async listObservabilitySummary(userId: string): Promise<ObservabilitySummary> {
    const userEvents = this.events.filter((event) => event.userId === userId);
    const userReports = this.reports.filter((report) => report.userId === userId);
    return {
      userId,
      generatedAt: "2026-03-03T11:00:00.000Z",
      totalAnalyticsEvents: userEvents.length,
      totalCrashReports: userReports.length,
      blockedActions: 0,
      deniedAccessEvents: 0,
      fatalCrashReports: 0,
      uniqueCorrelationIds: 0,
      sourceBreakdown: {
        web: userEvents.filter((event) => event.source === "web").length,
        ios: userEvents.filter((event) => event.source === "ios").length,
        backend: userEvents.filter((event) => event.source === "backend").length
      },
      canonicalCoverage: {
        trackedCanonicalEvents: 0,
        customEvents: userEvents.length
      },
      latestAnalyticsAt: userEvents[0]?.occurredAt ?? null,
      latestCrashAt: userReports[0]?.occurredAt ?? null
    };
  }

  async listOperationalAlerts(userId: string): Promise<OperationalAlert[]> {
    return [
      {
        id: "ALT-1",
        userId,
        code: "fatal_crash_slo_breach",
        severity: "critical",
        state: "open",
        source: "backend",
        summary: "Fatal crash SLO breached.",
        correlationId: "corr-ops-1",
        runbookId: "RB-fatal-crash",
        ownerOnCall: "backend_oncall",
        serviceLevelObjective: "fatal_crash_reports <= 0",
        currentValue: 1,
        thresholdValue: 0,
        triggeredAt: "2026-03-03T11:05:00.000Z",
        lastEvaluatedAt: "2026-03-03T11:06:00.000Z"
      }
    ];
  }

  async listOperationalRunbooks(): Promise<OperationalRunbook[]> {
    return [
      {
        id: "RB-fatal-crash",
        alertCode: "fatal_crash_slo_breach",
        title: "Fatal crash response",
        objective: "Stabilize runtime after fatal crashes.",
        ownerOnCall: "backend_oncall",
        steps: [
          {
            id: "step-1",
            title: "Acknowledge page",
            ownerRole: "on_call_engineer",
            slaMinutes: 5,
            outcome: "Incident acknowledged."
          }
        ],
        updatedAt: "2026-03-03T11:07:00.000Z"
      }
    ];
  }
}

describe("ManageObservabilityUseCase", () => {
  it("lists analytics and crash reports for a user", async () => {
    const useCase = new ManageObservabilityUseCase(new InMemoryObservabilityGateway());

    const events = await useCase.listAnalyticsEvents("user-1");
    const reports = await useCase.listCrashReports("user-1");

    expect(events).toHaveLength(1);
    expect(reports).toHaveLength(1);
  });

  it("throws when user id is empty", async () => {
    const useCase = new ManageObservabilityUseCase(new InMemoryObservabilityGateway());

    await expect(useCase.listAnalyticsEvents("")).rejects.toThrowError("missing_user_id");
  });

  it("loads observability summary for the operations dashboard", async () => {
    const useCase = new ManageObservabilityUseCase(new InMemoryObservabilityGateway());

    const summary = await useCase.listObservabilitySummary("user-1");

    expect(summary.totalAnalyticsEvents).toBe(1);
    expect(summary.totalCrashReports).toBe(1);
  });

  it("loads operational alerts and runbooks", async () => {
    const useCase = new ManageObservabilityUseCase(new InMemoryObservabilityGateway());

    const alerts = await useCase.listOperationalAlerts("user-1");
    const runbooks = await useCase.listOperationalRunbooks();

    expect(alerts).toHaveLength(1);
    expect(alerts[0]?.runbookId).toBe("RB-fatal-crash");
    expect(runbooks).toHaveLength(1);
    expect(runbooks[0]?.alertCode).toBe("fatal_crash_slo_breach");
  });
});
