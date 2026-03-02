import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, CrashReport, ObservabilitySummary } from "@flux/contracts";
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
});
