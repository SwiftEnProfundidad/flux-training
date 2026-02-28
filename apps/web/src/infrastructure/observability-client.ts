import type { AnalyticsEvent, CrashReport } from "@flux/contracts";
import type { ObservabilityGateway } from "../application/manage-observability";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiObservabilityGateway implements ObservabilityGateway {
  async createAnalyticsEvent(event: AnalyticsEvent): Promise<AnalyticsEvent> {
    const response = await fetch("/api/createAnalyticsEvent", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(event)
    });
    await assertApiResponse(response, "create_analytics_event_failed");
    const payload = (await response.json()) as { event: AnalyticsEvent };
    return payload.event;
  }

  async listAnalyticsEvents(userId: string): Promise<AnalyticsEvent[]> {
    const response = await fetch(`/api/listAnalyticsEvents?userId=${encodeURIComponent(userId)}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_analytics_events_failed");
    const payload = (await response.json()) as { events: AnalyticsEvent[] };
    return payload.events;
  }

  async createCrashReport(report: CrashReport): Promise<CrashReport> {
    const response = await fetch("/api/createCrashReport", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(report)
    });
    await assertApiResponse(response, "create_crash_report_failed");
    const payload = (await response.json()) as { report: CrashReport };
    return payload.report;
  }

  async listCrashReports(userId: string): Promise<CrashReport[]> {
    const response = await fetch(`/api/listCrashReports?userId=${encodeURIComponent(userId)}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_crash_reports_failed");
    const payload = (await response.json()) as { reports: CrashReport[] };
    return payload.reports;
  }
}

export const apiObservabilityGateway: ObservabilityGateway = new ApiObservabilityGateway();
