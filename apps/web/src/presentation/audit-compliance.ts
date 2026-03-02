import type { AnalyticsEvent, CrashReport } from "@flux/contracts";

export type AuditCategory = "analytics" | "crash";
export type AuditSeverity = "info" | "warning" | "fatal";
export type AuditSourceFilter = "all" | "web" | "ios" | "backend";
export type AuditCategoryFilter = "all" | AuditCategory;
export type AuditSeverityFilter = "all" | AuditSeverity;

export type AuditTimelineRow = {
  id: string;
  occurredAt: string;
  source: "web" | "ios" | "backend";
  category: AuditCategory;
  severity: AuditSeverity;
  name: string;
  domain: string;
  correlationId: string;
  summary: string;
};

export type AuditFilterInput = {
  query: string;
  source: AuditSourceFilter;
  category: AuditCategoryFilter;
  severity: AuditSeverityFilter;
  domain: string;
};

export function buildAuditTimelineRows(
  analyticsEvents: AnalyticsEvent[],
  crashReports: CrashReport[]
): AuditTimelineRow[] {
  const analyticsRows: AuditTimelineRow[] = analyticsEvents.map((event) => {
    const domain = asString(event.attributes.domain, "-");
    const correlationId = asString(event.attributes.correlationId, "-");
    return {
      id: `analytics:${event.name}:${event.occurredAt}:${event.source}`,
      occurredAt: event.occurredAt,
      source: event.source,
      category: "analytics",
      severity: "info",
      name: event.name,
      domain,
      correlationId,
      summary: asString(event.attributes.reason, asString(event.attributes.payloadValidation, "ok"))
    };
  });

  const crashRows: AuditTimelineRow[] = crashReports.map((report) => ({
    id: `crash:${report.source}:${report.occurredAt}:${report.message}`,
    occurredAt: report.occurredAt,
    source: report.source,
    category: "crash",
    severity: report.severity,
    name: report.message,
    domain: "-",
    correlationId: "-",
    summary: report.stackTrace ?? "-"
  }));

  return [...analyticsRows, ...crashRows].sort((left, right) =>
    right.occurredAt.localeCompare(left.occurredAt)
  );
}

export function filterAuditTimelineRows(
  rows: AuditTimelineRow[],
  filters: AuditFilterInput
): AuditTimelineRow[] {
  const query = filters.query.trim().toLowerCase();
  const domain = filters.domain.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesSource = filters.source === "all" || row.source === filters.source;
    const matchesCategory = filters.category === "all" || row.category === filters.category;
    const matchesSeverity = filters.severity === "all" || row.severity === filters.severity;
    const matchesDomain = domain.length === 0 || row.domain.toLowerCase().includes(domain);
    const matchesQuery =
      query.length === 0 ||
      row.name.toLowerCase().includes(query) ||
      row.summary.toLowerCase().includes(query) ||
      row.correlationId.toLowerCase().includes(query);
    return matchesSource && matchesCategory && matchesSeverity && matchesDomain && matchesQuery;
  });
}

export function exportAuditTimelineRowsToCSV(rows: AuditTimelineRow[]): string {
  const header = [
    "occurredAt",
    "source",
    "category",
    "severity",
    "name",
    "domain",
    "correlationId",
    "summary"
  ];
  const lines = rows.map((row) =>
    [
      row.occurredAt,
      row.source,
      row.category,
      row.severity,
      row.name,
      row.domain,
      row.correlationId,
      row.summary
    ]
      .map(escapeCSVCell)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
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

function escapeCSVCell(value: string): string {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
}
