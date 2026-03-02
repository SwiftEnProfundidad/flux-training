import type {
  AnalyticsEvent,
  CrashReport,
  ObservabilitySummary,
  OperationalAlert,
  OperationalRunbook
} from "@flux/contracts";
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

  async listObservabilitySummary(userId: string): Promise<ObservabilitySummary> {
    const response = await fetch(
      `/api/listObservabilitySummary?userId=${encodeURIComponent(userId)}`,
      { headers: createApiHeaders() }
    );
    await assertApiResponse(response, "list_observability_summary_failed");
    const payload = (await response.json()) as { summary: ObservabilitySummary };
    return payload.summary;
  }

  async listOperationalAlerts(userId: string): Promise<OperationalAlert[]> {
    const response = await fetch(
      `/api/listOperationalAlerts?userId=${encodeURIComponent(userId)}`,
      { headers: createApiHeaders() }
    );
    await assertApiResponse(response, "list_operational_alerts_failed");
    const payload = (await response.json()) as { alerts: OperationalAlert[] };
    return payload.alerts;
  }

  async listOperationalRunbooks(): Promise<OperationalRunbook[]> {
    const response = await fetch("/api/listOperationalRunbooks", {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_operational_runbooks_failed");
    const payload = (await response.json()) as { runbooks: OperationalRunbook[] };
    return payload.runbooks;
  }
}

export const apiObservabilityGateway: ObservabilityGateway = new ApiObservabilityGateway();
