import {
  operationalAlertSchema,
  type OperationalAlert,
  type ObservabilitySummary,
  type SupportIncident
} from "@flux/contracts";
import { ListObservabilitySummaryUseCase } from "./list-observability-summary";
import { ListSupportIncidentsUseCase } from "./list-support-incidents";

type SeverityRank = Record<OperationalAlert["severity"], number>;

const severityRank: SeverityRank = {
  critical: 0,
  high: 1,
  medium: 2
};

function resolvePrimaryCorrelation(summary: ObservabilitySummary, incidents: SupportIncident[]): string {
  const incidentCorrelation = incidents.find((incident) => incident.correlationId.trim().length > 0)
    ?.correlationId;
  if (incidentCorrelation !== undefined) {
    return incidentCorrelation;
  }
  return `corr-observability-${summary.userId}`;
}

function sortAlerts(alerts: OperationalAlert[]): OperationalAlert[] {
  return [...alerts].sort((left, right) => {
    const severityDelta = severityRank[left.severity] - severityRank[right.severity];
    if (severityDelta !== 0) {
      return severityDelta;
    }
    return right.triggeredAt.localeCompare(left.triggeredAt);
  });
}

export class ListOperationalAlertsUseCase {
  constructor(
    private readonly listObservabilitySummaryUseCase: ListObservabilitySummaryUseCase,
    private readonly listSupportIncidentsUseCase: ListSupportIncidentsUseCase
  ) {}

  async execute(userId: string): Promise<OperationalAlert[]> {
    const normalizedUserId = userId.trim();
    if (normalizedUserId.length === 0) {
      throw new Error("missing_user_id");
    }

    const [summary, incidents] = await Promise.all([
      this.listObservabilitySummaryUseCase.execute(normalizedUserId),
      this.listSupportIncidentsUseCase.execute(normalizedUserId)
    ]);

    const correlationId = resolvePrimaryCorrelation(summary, incidents);
    const triggeredAt =
      summary.latestCrashAt ?? summary.latestAnalyticsAt ?? summary.generatedAt;

    const alerts: OperationalAlert[] = [];

    if (summary.fatalCrashReports > 0) {
      alerts.push({
        id: `ALT-${normalizedUserId}-fatal-crash`,
        userId: normalizedUserId,
        code: "fatal_crash_slo_breach",
        severity: "critical",
        state: "open",
        source: "backend",
        summary: "Fatal crash SLO breached. Immediate containment required.",
        correlationId,
        runbookId: "RB-fatal-crash",
        ownerOnCall: "backend_oncall",
        serviceLevelObjective: "fatal_crash_reports <= 0",
        currentValue: summary.fatalCrashReports,
        thresholdValue: 0,
        triggeredAt,
        lastEvaluatedAt: summary.generatedAt
      });
    }

    if (summary.deniedAccessEvents >= 3) {
      alerts.push({
        id: `ALT-${normalizedUserId}-denied-access`,
        userId: normalizedUserId,
        code: "denied_access_spike",
        severity: "high",
        state: "open",
        source: "web",
        summary: "Denied access events exceeded policy threshold.",
        correlationId,
        runbookId: "RB-denied-access",
        ownerOnCall: "security_oncall",
        serviceLevelObjective: "denied_access_events < 3 per cycle",
        currentValue: summary.deniedAccessEvents,
        thresholdValue: 2,
        triggeredAt,
        lastEvaluatedAt: summary.generatedAt
      });
    }

    if (summary.blockedActions >= 5) {
      alerts.push({
        id: `ALT-${normalizedUserId}-blocked-actions`,
        userId: normalizedUserId,
        code: "blocked_action_spike",
        severity: "high",
        state: "open",
        source: "web",
        summary: "Blocked actions exceeded operational threshold.",
        correlationId,
        runbookId: "RB-blocked-actions",
        ownerOnCall: "operations_oncall",
        serviceLevelObjective: "blocked_actions < 5 per cycle",
        currentValue: summary.blockedActions,
        thresholdValue: 4,
        triggeredAt,
        lastEvaluatedAt: summary.generatedAt
      });
    }

    if (
      summary.totalAnalyticsEvents > 0 &&
      summary.canonicalCoverage.customEvents > summary.canonicalCoverage.trackedCanonicalEvents
    ) {
      alerts.push({
        id: `ALT-${normalizedUserId}-canonical-coverage`,
        userId: normalizedUserId,
        code: "canonical_coverage_drop",
        severity: "medium",
        state: "open",
        source: "backend",
        summary: "Canonical telemetry coverage dropped below policy target.",
        correlationId,
        runbookId: "RB-canonical-coverage",
        ownerOnCall: "platform_oncall",
        serviceLevelObjective: "custom_events <= canonical_events",
        currentValue: summary.canonicalCoverage.customEvents,
        thresholdValue: summary.canonicalCoverage.trackedCanonicalEvents,
        triggeredAt,
        lastEvaluatedAt: summary.generatedAt
      });
    }

    const unresolvedHighIncidents = incidents.filter(
      (incident) => incident.severity === "high" && incident.state !== "resolved"
    ).length;
    if (unresolvedHighIncidents > 0) {
      alerts.push({
        id: `ALT-${normalizedUserId}-high-backlog`,
        userId: normalizedUserId,
        code: "high_incident_backlog",
        severity: "high",
        state: "open",
        source: "backend",
        summary: "High-severity incident backlog needs immediate triage.",
        correlationId,
        runbookId: "RB-high-incident-backlog",
        ownerOnCall: "support_oncall",
        serviceLevelObjective: "high_severity_open_incidents <= 0",
        currentValue: unresolvedHighIncidents,
        thresholdValue: 0,
        triggeredAt,
        lastEvaluatedAt: summary.generatedAt
      });
    }

    return operationalAlertSchema.array().parse(sortAlerts(alerts));
  }
}
