import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, CrashReport } from "@flux/contracts";
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
});
