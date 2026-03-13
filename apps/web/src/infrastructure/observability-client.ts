import {
  analyticsEventSchema,
  crashReportSchema,
  observabilitySummarySchema,
  type AnalyticsEvent,
  type CrashReport,
  type ObservabilitySummary,
  ActivityLogEntry,
  ForensicAuditExport,
  ForensicAuditExportRequest,
  OperationalAlert,
  OperationalRunbook,
  StructuredLog
} from "@flux/contracts";
import type { ObservabilityGateway } from "../application/manage-observability";
import { assertApiResponse, createApiHeaders } from "./api-client";

const localPreviewAnalyticsStorageKey = "flux_training_preview_analytics_events";
const localPreviewCrashStorageKey = "flux_training_preview_crash_reports";
let fallbackPreviewAnalyticsEvents: AnalyticsEvent[] = [];
let fallbackPreviewCrashReports: CrashReport[] = [];

function isLocalPreviewApiSession(headers: Record<string, string>): boolean {
  const authorization = headers.Authorization;
  return typeof authorization === "string" && authorization.startsWith("Bearer local-preview-token-");
}

function readPreviewStorageValue<T>(
  storageKey: string,
  fallbackRecords: T[],
  parser: (value: unknown) => T[]
): T[] {
  if (typeof window === "undefined" || window.localStorage === undefined) {
    return fallbackRecords;
  }

  const rawValue = window.localStorage.getItem(storageKey);
  if (rawValue === null) {
    return [];
  }

  try {
    return parser(JSON.parse(rawValue) as unknown);
  } catch {
    return [];
  }
}

function writePreviewStorageValue<T>(
  storageKey: string,
  items: T[],
  setFallbackRecords: (nextRecords: T[]) => void
): void {
  if (typeof window === "undefined" || window.localStorage === undefined) {
    setFallbackRecords(items);
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(items));
}

function readPreviewAnalyticsEvents(): AnalyticsEvent[] {
  return readPreviewStorageValue(
    localPreviewAnalyticsStorageKey,
    fallbackPreviewAnalyticsEvents,
    (value) => analyticsEventSchema.array().parse(value)
  );
}

function writePreviewAnalyticsEvents(items: AnalyticsEvent[]): void {
  writePreviewStorageValue(localPreviewAnalyticsStorageKey, items, (nextRecords) => {
    fallbackPreviewAnalyticsEvents = nextRecords;
  });
}

function readPreviewCrashReports(): CrashReport[] {
  return readPreviewStorageValue(localPreviewCrashStorageKey, fallbackPreviewCrashReports, (value) =>
    crashReportSchema.array().parse(value)
  );
}

function writePreviewCrashReports(items: CrashReport[]): void {
  writePreviewStorageValue(localPreviewCrashStorageKey, items, (nextRecords) => {
    fallbackPreviewCrashReports = nextRecords;
  });
}

function buildPreviewObservabilitySummary(userId: string): ObservabilitySummary {
  const analyticsEvents = readPreviewAnalyticsEvents().filter((event) => event.userId === userId);
  const crashReports = readPreviewCrashReports().filter((report) => report.userId === userId);
  const correlationIds = new Set(
    analyticsEvents
      .map((event) => event.attributes.correlationId)
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
  );
  const trackedCanonicalEvents = analyticsEvents.filter((event) => event.name !== "custom").length;
  const customEvents = analyticsEvents.length - trackedCanonicalEvents;

  return observabilitySummarySchema.parse({
    userId,
    generatedAt: new Date().toISOString(),
    totalAnalyticsEvents: analyticsEvents.length,
    totalCrashReports: crashReports.length,
    blockedActions: analyticsEvents.filter((event) => event.name === "dashboard_action_blocked").length,
    deniedAccessEvents: analyticsEvents.filter(
      (event) => event.name === "dashboard_domain_access_denied"
    ).length,
    fatalCrashReports: crashReports.filter((report) => report.severity === "fatal").length,
    uniqueCorrelationIds: correlationIds.size,
    sourceBreakdown: {
      web: analyticsEvents.filter((event) => event.source === "web").length,
      ios: analyticsEvents.filter((event) => event.source === "ios").length,
      backend: analyticsEvents.filter((event) => event.source === "backend").length
    },
    canonicalCoverage: {
      trackedCanonicalEvents,
      customEvents
    },
    latestAnalyticsAt: analyticsEvents[0]?.occurredAt ?? null,
    latestCrashAt: crashReports[0]?.occurredAt ?? null
  });
}

export function resetLocalPreviewObservabilityStore(): void {
  fallbackPreviewAnalyticsEvents = [];
  fallbackPreviewCrashReports = [];

  if (typeof window === "undefined" || window.localStorage === undefined) {
    return;
  }

  window.localStorage.removeItem(localPreviewAnalyticsStorageKey);
  window.localStorage.removeItem(localPreviewCrashStorageKey);
}

class ApiObservabilityGateway implements ObservabilityGateway {
  async createAnalyticsEvent(event: AnalyticsEvent): Promise<AnalyticsEvent> {
    const headers = createApiHeaders(undefined, true);
    if (isLocalPreviewApiSession(headers)) {
      const events = readPreviewAnalyticsEvents();
      events.unshift(event);
      writePreviewAnalyticsEvents(events);
      return event;
    }

    const response = await fetch("/api/createAnalyticsEvent", {
      method: "POST",
      headers,
      body: JSON.stringify(event)
    });
    await assertApiResponse(response, "create_analytics_event_failed");
    const payload = (await response.json()) as { event: AnalyticsEvent };
    return payload.event;
  }

  async listAnalyticsEvents(userId: string): Promise<AnalyticsEvent[]> {
    const headers = createApiHeaders();
    if (isLocalPreviewApiSession(headers)) {
      return readPreviewAnalyticsEvents().filter((event) => event.userId === userId);
    }

    const response = await fetch(`/api/listAnalyticsEvents?userId=${encodeURIComponent(userId)}`, {
      headers
    });
    await assertApiResponse(response, "list_analytics_events_failed");
    const payload = (await response.json()) as { events: AnalyticsEvent[] };
    return payload.events;
  }

  async createCrashReport(report: CrashReport): Promise<CrashReport> {
    const headers = createApiHeaders(undefined, true);
    if (isLocalPreviewApiSession(headers)) {
      const reports = readPreviewCrashReports();
      reports.unshift(report);
      writePreviewCrashReports(reports);
      return report;
    }

    const response = await fetch("/api/createCrashReport", {
      method: "POST",
      headers,
      body: JSON.stringify(report)
    });
    await assertApiResponse(response, "create_crash_report_failed");
    const payload = (await response.json()) as { report: CrashReport };
    return payload.report;
  }

  async listCrashReports(userId: string): Promise<CrashReport[]> {
    const headers = createApiHeaders();
    if (isLocalPreviewApiSession(headers)) {
      return readPreviewCrashReports().filter((report) => report.userId === userId);
    }

    const response = await fetch(`/api/listCrashReports?userId=${encodeURIComponent(userId)}`, {
      headers
    });
    await assertApiResponse(response, "list_crash_reports_failed");
    const payload = (await response.json()) as { reports: CrashReport[] };
    return payload.reports;
  }

  async listObservabilitySummary(userId: string): Promise<ObservabilitySummary> {
    const headers = createApiHeaders();
    if (isLocalPreviewApiSession(headers)) {
      return buildPreviewObservabilitySummary(userId);
    }

    const response = await fetch(
      `/api/listObservabilitySummary?userId=${encodeURIComponent(userId)}`,
      { headers }
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

  async listStructuredLogs(userId: string): Promise<StructuredLog[]> {
    const response = await fetch(`/api/listStructuredLogs?userId=${encodeURIComponent(userId)}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_structured_logs_failed");
    const payload = (await response.json()) as { logs: StructuredLog[] };
    return payload.logs;
  }

  async listActivityLog(userId: string): Promise<ActivityLogEntry[]> {
    const response = await fetch(`/api/listActivityLog?userId=${encodeURIComponent(userId)}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_activity_log_failed");
    const payload = (await response.json()) as { activityLog: ActivityLogEntry[] };
    return payload.activityLog;
  }

  async exportForensicAudit(payload: ForensicAuditExportRequest): Promise<ForensicAuditExport> {
    const response = await fetch("/api/exportForensicAudit", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(payload)
    });
    await assertApiResponse(response, "export_forensic_audit_failed");
    const parsedPayload = (await response.json()) as { exportResult: ForensicAuditExport };
    return parsedPayload.exportResult;
  }
}

export const apiObservabilityGateway: ObservabilityGateway = new ApiObservabilityGateway();
