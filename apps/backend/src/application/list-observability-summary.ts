import {
  canonicalAnalyticsEventNameSchema,
  observabilitySummarySchema,
  type AnalyticsEvent,
  type CrashReport,
  type ObservabilitySummary
} from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";

function resolveLatestTimestamp(timestamps: string[]): string | null {
  if (timestamps.length === 0) {
    return null;
  }
  return timestamps.sort((left, right) => right.localeCompare(left))[0] ?? null;
}

function resolveCanonicalCounters(events: AnalyticsEvent[]): {
  trackedCanonicalEvents: number;
  customEvents: number;
} {
  let trackedCanonicalEvents = 0;
  let customEvents = 0;
  for (const event of events) {
    const rawCanonical = String(event.attributes.canonicalEventName ?? "custom");
    const canonical = canonicalAnalyticsEventNameSchema.safeParse(rawCanonical);
    if (canonical.success && canonical.data !== "custom") {
      trackedCanonicalEvents += 1;
      continue;
    }
    customEvents += 1;
  }
  return {
    trackedCanonicalEvents,
    customEvents
  };
}

export class ListObservabilitySummaryUseCase {
  constructor(
    private readonly analyticsEventRepository: AnalyticsEventRepository,
    private readonly crashReportRepository: CrashReportRepository,
    private readonly nowFactory: () => string = () => new Date().toISOString()
  ) {}

  async execute(userId: string): Promise<ObservabilitySummary> {
    const normalizedUserId = userId.trim();
    if (normalizedUserId.length === 0) {
      throw new Error("missing_user_id");
    }

    const [events, crashReports] = await Promise.all([
      this.analyticsEventRepository.listByUserId(normalizedUserId),
      this.crashReportRepository.listByUserId(normalizedUserId)
    ]);

    const blockedActions = events.filter((event) => event.name === "dashboard_action_blocked").length;
    const deniedAccessEvents = events.filter(
      (event) => event.name === "dashboard_domain_access_denied"
    ).length;
    const fatalCrashReports = crashReports.filter((report) => report.severity === "fatal").length;
    const uniqueCorrelationIds = new Set(
      events
        .map((event) => event.attributes.correlationId)
        .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    ).size;
    const sourceBreakdown = events.reduce(
      (accumulator, event) => {
        accumulator[event.source] += 1;
        return accumulator;
      },
      { web: 0, ios: 0, backend: 0 }
    );
    const canonicalCoverage = resolveCanonicalCounters(events);
    const latestAnalyticsAt = resolveLatestTimestamp(events.map((event) => event.occurredAt));
    const latestCrashAt = resolveLatestTimestamp(crashReports.map((report) => report.occurredAt));

    return observabilitySummarySchema.parse({
      userId: normalizedUserId,
      generatedAt: this.nowFactory(),
      totalAnalyticsEvents: events.length,
      totalCrashReports: crashReports.length,
      blockedActions,
      deniedAccessEvents,
      fatalCrashReports,
      uniqueCorrelationIds,
      sourceBreakdown,
      canonicalCoverage,
      latestAnalyticsAt,
      latestCrashAt
    });
  }
}
