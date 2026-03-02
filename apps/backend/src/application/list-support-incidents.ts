import {
  supportIncidentSchema,
  type AnalyticsEvent,
  type CrashReport,
  type SupportIncident
} from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";

export class ListSupportIncidentsUseCase {
  constructor(
    private readonly analyticsEventRepository: AnalyticsEventRepository,
    private readonly crashReportRepository: CrashReportRepository
  ) {}

  async execute(userId: string): Promise<SupportIncident[]> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }

    const [events, reports] = await Promise.all([
      this.analyticsEventRepository.listByUserId(userId),
      this.crashReportRepository.listByUserId(userId)
    ]);

    const incidents = buildSupportIncidents(userId, events, reports);
    return supportIncidentSchema.array().parse(incidents);
  }
}

function buildSupportIncidents(
  userId: string,
  analyticsEvents: AnalyticsEvent[],
  crashReports: CrashReport[]
): SupportIncident[] {
  const eventIncidents = analyticsEvents
    .filter((event) => shouldOpenIncidentFromEvent(event))
    .map((event, index) => {
      const reason = asString(event.attributes.reason, "runtime_event");
      const payloadValidation = asString(event.attributes.payloadValidation, "ok");
      return {
        id: `INC-EVT-${String(index + 1).padStart(4, "0")}`,
        userId,
        openedAt: event.occurredAt,
        domain: asString(event.attributes.domain, "operations"),
        severity: resolveEventSeverity(reason, payloadValidation),
        state: "open",
        source: "analytics",
        summary: `${event.name} · ${reason}`,
        correlationId: asString(event.attributes.correlationId, "-")
      } satisfies SupportIncident;
    });

  const crashIncidents = crashReports.map((report, index) => ({
    id: `INC-CRASH-${String(index + 1).padStart(4, "0")}`,
    userId,
    openedAt: report.occurredAt,
    domain: "operations",
    severity: report.severity === "fatal" ? "high" : "medium",
    state: report.severity === "fatal" ? "open" : "in_progress",
    source: "crash",
    summary: report.message,
    correlationId: "-"
  } satisfies SupportIncident));

  return [...eventIncidents, ...crashIncidents].sort((left, right) =>
    right.openedAt.localeCompare(left.openedAt)
  );
}

function shouldOpenIncidentFromEvent(event: AnalyticsEvent): boolean {
  const eventName = event.name.toLowerCase();
  if (eventName.includes("blocked") || eventName.includes("denied") || eventName.includes("error")) {
    return true;
  }
  const payloadValidation = asString(event.attributes.payloadValidation, "ok");
  return payloadValidation.toLowerCase() === "error";
}

function resolveEventSeverity(
  reason: string,
  payloadValidation: string
): SupportIncident["severity"] {
  const loweredReason = reason.toLowerCase();
  if (
    loweredReason.includes("denied") ||
    loweredReason.includes("forbidden") ||
    payloadValidation.toLowerCase() === "error"
  ) {
    return "high";
  }
  if (loweredReason.includes("validation") || loweredReason.includes("missing")) {
    return "medium";
  }
  return "low";
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
