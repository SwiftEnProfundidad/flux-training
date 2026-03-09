import {
  activityLogEntrySchema,
  type ActivityLogEntry,
  type AnalyticsEvent,
  type CrashReport,
  type DeniedAccessAudit
} from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";

export type ActivityLogListOptions = {
  fromDate?: string | undefined;
  toDate?: string | undefined;
  limit?: number | undefined;
  action?: ActivityLogEntry["action"] | undefined;
  outcome?: ActivityLogEntry["outcome"] | undefined;
  source?: ActivityLogEntry["source"] | undefined;
  query?: string | undefined;
};

function resolveAction(eventName: string): ActivityLogEntry["action"] | undefined {
  const normalized = eventName.toLowerCase();
  if (normalized.includes("role_changed")) {
    return "role_changed";
  }
  if (normalized.includes("domain_changed")) {
    return "domain_changed";
  }
  if (normalized.includes("access_denied")) {
    return "access_denied";
  }
  if (normalized.includes("action_blocked")) {
    return "action_blocked";
  }
  if (normalized.includes("incident_opened")) {
    return "incident_opened";
  }
  if (normalized.includes("forensic") || normalized.includes("audit_timeline_exported")) {
    return "forensic_exported";
  }
  if (normalized.includes("consent")) {
    return "consent_recorded";
  }
  if (normalized.includes("data_export")) {
    return "data_export_requested";
  }
  if (normalized.includes("data_deletion")) {
    return "data_deletion_requested";
  }
  if (normalized.includes("crash_reported")) {
    return "crash_reported";
  }
  return undefined;
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

function resolveActorRole(event: AnalyticsEvent): ActivityLogEntry["actorRole"] {
  const role = asString(event.attributes.role, "").trim().toLowerCase();
  if (role === "athlete" || role === "coach" || role === "admin") {
    return role;
  }
  if (event.source === "backend") {
    return "system";
  }
  return "athlete";
}

function resolveOutcome(event: AnalyticsEvent, action: ActivityLogEntry["action"]): ActivityLogEntry["outcome"] {
  const payloadValidation = asString(event.attributes.payloadValidation, "ok").toLowerCase();
  if (payloadValidation === "error") {
    return "error";
  }
  if (action === "access_denied" || action === "action_blocked") {
    return "denied";
  }
  return "success";
}

function resolveResource(event: AnalyticsEvent): string {
  const domain = asString(event.attributes.domain, "operations");
  const route = asString(event.attributes.backendRoute, "-");
  return `${domain}:${route}`;
}

function buildActivityEntriesFromEvents(
  events: AnalyticsEvent[],
  userId: string
): ActivityLogEntry[] {
  return events
    .map((event, index) => {
      const action = resolveAction(event.name);
      if (action === undefined) {
        return null;
      }

      const correlationId = asString(event.attributes.correlationId, `corr-evt-${index + 1}`);
      return {
        id: `ACT-EVT-${String(index + 1).padStart(4, "0")}`,
        userId,
        occurredAt: event.occurredAt,
        actorRole: resolveActorRole(event),
        action,
        resource: resolveResource(event),
        domain: asString(event.attributes.domain, "operations"),
        source: event.source,
        outcome: resolveOutcome(event, action),
        correlationId,
        summary: asString(event.attributes.reason, event.name)
      } satisfies ActivityLogEntry;
    })
    .filter((entry): entry is ActivityLogEntry => entry !== null);
}

function buildActivityEntriesFromDeniedAudits(
  deniedAudits: DeniedAccessAudit[],
  userId: string
): ActivityLogEntry[] {
  return deniedAudits.map((audit, index) => ({
    id: `ACT-DENIED-${String(index + 1).padStart(4, "0")}`,
    userId,
    occurredAt: audit.occurredAt,
    actorRole: audit.role,
    action: "access_denied",
    resource: `${audit.domain}:${audit.action}`,
    domain: audit.domain,
    source: "backend",
    outcome: "denied",
    correlationId: audit.correlationId,
    summary: `${audit.action} denied (${audit.reason})`
  }));
}

function buildActivityEntriesFromCrashReports(
  crashReports: CrashReport[],
  userId: string
): ActivityLogEntry[] {
  return crashReports.map((report, index) => ({
    id: `ACT-CRASH-${String(index + 1).padStart(4, "0")}`,
    userId,
    occurredAt: report.occurredAt,
    actorRole: "system",
    action: "crash_reported",
    resource: "runtime:crash",
    domain: "operations",
    source: report.source,
    outcome: "error",
    correlationId: asOptionalNonEmptyString(report.correlationId, `corr-crash-${index + 1}`),
    summary: report.message
  }));
}

function filterAndLimitLogs(entries: ActivityLogEntry[], options?: ActivityLogListOptions): ActivityLogEntry[] {
  const fromDate = options?.fromDate;
  const toDate = options?.toDate;
  const limit = options?.limit;
  const action = options?.action;
  const outcome = options?.outcome;
  const source = options?.source;
  const query = options?.query?.trim().toLowerCase();

  const filteredByFromDate =
    fromDate === undefined ? entries : entries.filter((entry) => entry.occurredAt >= fromDate);
  const filteredByRange =
    toDate === undefined
      ? filteredByFromDate
      : filteredByFromDate.filter((entry) => entry.occurredAt <= toDate);
  const filteredByAction =
    action === undefined ? filteredByRange : filteredByRange.filter((entry) => entry.action === action);
  const filteredByOutcome =
    outcome === undefined
      ? filteredByAction
      : filteredByAction.filter((entry) => entry.outcome === outcome);
  const filteredBySource =
    source === undefined ? filteredByOutcome : filteredByOutcome.filter((entry) => entry.source === source);
  const filteredByQuery =
    query === undefined || query.length === 0
      ? filteredBySource
      : filteredBySource.filter((entry) => {
          return (
            entry.summary.toLowerCase().includes(query) ||
            entry.resource.toLowerCase().includes(query) ||
            entry.domain.toLowerCase().includes(query) ||
            entry.correlationId.toLowerCase().includes(query)
          );
        });

  if (limit === undefined) {
    return filteredByQuery;
  }
  return filteredByQuery.slice(0, limit);
}

export class ListActivityLogUseCase {
  constructor(
    private readonly analyticsEventRepository: AnalyticsEventRepository,
    private readonly deniedAccessAuditRepository: DeniedAccessAuditRepository,
    private readonly crashReportRepository: CrashReportRepository
  ) {}

  async execute(userId: string, options?: ActivityLogListOptions): Promise<ActivityLogEntry[]> {
    const normalizedUserId = userId.trim();
    if (normalizedUserId.length === 0) {
      throw new Error("missing_user_id");
    }

    const [events, deniedAudits, crashReports] = await Promise.all([
      this.analyticsEventRepository.listByUserId(normalizedUserId),
      this.deniedAccessAuditRepository.listByUserId(normalizedUserId),
      this.crashReportRepository.listByUserId(normalizedUserId)
    ]);

    const combinedEntries = [
      ...buildActivityEntriesFromEvents(events, normalizedUserId),
      ...buildActivityEntriesFromDeniedAudits(deniedAudits, normalizedUserId),
      ...buildActivityEntriesFromCrashReports(crashReports, normalizedUserId)
    ].sort((left, right) => right.occurredAt.localeCompare(left.occurredAt));

    return activityLogEntrySchema.array().parse(filterAndLimitLogs(combinedEntries, options));
  }
}
