import {
  structuredLogSchema,
  type AnalyticsEvent,
  type CrashReport,
  type DeniedAccessAudit,
  type StructuredLog
} from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";

export type StructuredLogListOptions = {
  fromDate?: string | undefined;
  toDate?: string | undefined;
  limit?: number | undefined;
  level?: StructuredLog["level"] | undefined;
  category?: StructuredLog["category"] | undefined;
  source?: StructuredLog["source"] | undefined;
  query?: string | undefined;
};

function resolveAnalyticsCategory(eventName: string): StructuredLog["category"] {
  const normalizedEventName = eventName.toLowerCase();
  if (
    normalizedEventName.includes("denied") ||
    normalizedEventName.includes("blocked") ||
    normalizedEventName.includes("role") ||
    normalizedEventName.includes("domain")
  ) {
    return "access";
  }
  if (
    normalizedEventName.includes("consent") ||
    normalizedEventName.includes("deletion") ||
    normalizedEventName.includes("export")
  ) {
    return "compliance";
  }
  return "analytics";
}

function resolveAnalyticsLevel(event: AnalyticsEvent): StructuredLog["level"] {
  const normalizedEventName = event.name.toLowerCase();
  const payloadValidation = String(event.attributes.payloadValidation ?? "ok").toLowerCase();
  if (payloadValidation === "error") {
    return "error";
  }
  if (normalizedEventName.includes("denied") || normalizedEventName.includes("blocked")) {
    return "warning";
  }
  return "info";
}

function asString(value: string | number | boolean | undefined, fallback: string): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function asOptionalNonEmptyString(value: string | undefined, fallback: string): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  return fallback;
}

function filterAndLimitLogs(logs: StructuredLog[], options?: StructuredLogListOptions): StructuredLog[] {
  const fromDate = options?.fromDate;
  const toDate = options?.toDate;
  const limit = options?.limit;
  const level = options?.level;
  const category = options?.category;
  const source = options?.source;
  const query = options?.query?.trim().toLowerCase();

  const filteredByFromDate =
    fromDate === undefined ? logs : logs.filter((log) => log.occurredAt >= fromDate);
  const filteredByRange =
    toDate === undefined
      ? filteredByFromDate
      : filteredByFromDate.filter((log) => log.occurredAt <= toDate);
  const filteredByLevel =
    level === undefined ? filteredByRange : filteredByRange.filter((log) => log.level === level);
  const filteredByCategory =
    category === undefined
      ? filteredByLevel
      : filteredByLevel.filter((log) => log.category === category);
  const filteredBySource =
    source === undefined
      ? filteredByCategory
      : filteredByCategory.filter((log) => log.source === source);
  const filteredByQuery =
    query === undefined || query.length === 0
      ? filteredBySource
      : filteredBySource.filter((log) => {
          return (
            log.eventName.toLowerCase().includes(query) ||
            log.domain.toLowerCase().includes(query) ||
            log.correlationId.toLowerCase().includes(query) ||
            log.summary.toLowerCase().includes(query)
          );
        });

  if (limit === undefined) {
    return filteredByQuery;
  }
  return filteredByQuery.slice(0, limit);
}

export class ListStructuredLogsUseCase {
  constructor(
    private readonly analyticsEventRepository: AnalyticsEventRepository,
    private readonly crashReportRepository: CrashReportRepository,
    private readonly deniedAccessAuditRepository: DeniedAccessAuditRepository
  ) {}

  async execute(userId: string, options?: StructuredLogListOptions): Promise<StructuredLog[]> {
    const normalizedUserId = userId.trim();
    if (normalizedUserId.length === 0) {
      throw new Error("missing_user_id");
    }

    const [events, crashReports, deniedAudits] = await Promise.all([
      this.analyticsEventRepository.listByUserId(normalizedUserId),
      this.crashReportRepository.listByUserId(normalizedUserId),
      this.deniedAccessAuditRepository.listByUserId(normalizedUserId)
    ]);

    const analyticsLogs: StructuredLog[] = events.map((event, index) => ({
      id: `LOG-EVT-${String(index + 1).padStart(4, "0")}`,
      userId: normalizedUserId,
      occurredAt: event.occurredAt,
      source: event.source,
      level: resolveAnalyticsLevel(event),
      category: resolveAnalyticsCategory(event.name),
      eventName: event.name,
      domain: asString(event.attributes.domain, "operations"),
      correlationId: asString(event.attributes.correlationId, `corr-evt-${index + 1}`),
      summary: asString(event.attributes.reason, asString(event.attributes.payloadValidation, "ok")),
      attributes: event.attributes
    }));

    const crashLogs: StructuredLog[] = crashReports.map((report, index) => ({
      id: `LOG-CRASH-${String(index + 1).padStart(4, "0")}`,
      userId: normalizedUserId,
      occurredAt: report.occurredAt,
      source: report.source,
      level: report.severity === "fatal" ? "critical" : "warning",
      category: "crash",
      eventName: "crash_reported",
      domain: "operations",
      correlationId: asOptionalNonEmptyString(report.correlationId, `corr-crash-${index + 1}`),
      summary: report.message,
      attributes: {
        severity: report.severity,
        stackTrace: report.stackTrace ?? "-"
      }
    }));

    const deniedAuditLogs: StructuredLog[] = deniedAudits.map((audit: DeniedAccessAudit, index) => ({
      id: `LOG-DENIED-${String(index + 1).padStart(4, "0")}`,
      userId: normalizedUserId,
      occurredAt: audit.occurredAt,
      source: "backend",
      level: "warning",
      category: "access",
      eventName: "denied_access_audit",
      domain: audit.domain,
      correlationId: audit.correlationId,
      summary: `${audit.action} denied: ${audit.reason}`,
      attributes: {
        role: audit.role,
        action: audit.action,
        trigger: audit.trigger,
        reason: audit.reason
      }
    }));

    const combinedLogs = [...analyticsLogs, ...crashLogs, ...deniedAuditLogs].sort((left, right) =>
      right.occurredAt.localeCompare(left.occurredAt)
    );

    return structuredLogSchema.array().parse(filterAndLimitLogs(combinedLogs, options));
  }
}
