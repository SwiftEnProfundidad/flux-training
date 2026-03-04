import type {
  AnalyticsEvent,
  CrashReport,
  NutritionLog,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";

export type BillingInvoiceStatus = "draft" | "open" | "paid" | "overdue";
export type BillingInvoiceStatusFilter = "all" | BillingInvoiceStatus;
export type SupportIncidentState = "open" | "in_progress" | "resolved";
export type SupportIncidentStateFilter = "all" | SupportIncidentState;
export type SupportIncidentSeverity = "high" | "medium" | "low";
export type SupportIncidentSeverityFilter = "all" | SupportIncidentSeverity;

export type BillingInvoiceRow = {
  id: string;
  accountId: string;
  period: string;
  amountEUR: number;
  status: BillingInvoiceStatus;
  source: "auto" | "manual";
};

export type SupportIncidentRow = {
  id: string;
  openedAt: string;
  domain: string;
  severity: SupportIncidentSeverity;
  state: SupportIncidentState;
  summary: string;
  source: "analytics" | "crash";
  correlationId: string;
};

export type BillingInvoiceFilterInput = {
  query: string;
  invoiceStatus: BillingInvoiceStatusFilter;
};

export type SupportIncidentFilterInput = {
  query: string;
  domain: string;
  state: SupportIncidentStateFilter;
  severity: SupportIncidentSeverityFilter;
};

export function buildBillingInvoiceRows(
  plans: TrainingPlan[],
  sessions: WorkoutSessionInput[],
  nutritionLogs: NutritionLog[]
): BillingInvoiceRow[] {
  const accountIds = new Set<string>();
  plans.forEach((plan) => accountIds.add(plan.userId));
  sessions.forEach((session) => accountIds.add(session.userId));
  nutritionLogs.forEach((log) => accountIds.add(log.userId));
  if (accountIds.size === 0) {
    return [];
  }

  return [...accountIds]
    .sort((left, right) => left.localeCompare(right))
    .map((accountId, index) => {
      const accountPlans = plans.filter((plan) => plan.userId === accountId).length;
      const accountSessions = sessions.filter((session) => session.userId === accountId).length;
      const accountNutritionLogs = nutritionLogs.filter((log) => log.userId === accountId).length;
      const amountEUR = Number(
        Math.max(9, accountPlans * 14 + accountSessions * 5 + accountNutritionLogs * 2).toFixed(2)
      );
      const status = resolveBillingInvoiceStatus(index, accountSessions, accountPlans);
      const period = resolveBillingPeriod(sessions, nutritionLogs, accountId);
      return {
        id: `INV-${String(index + 1).padStart(4, "0")}`,
        accountId,
        period,
        amountEUR,
        status,
        source: accountPlans === 0 ? "manual" : "auto"
      } satisfies BillingInvoiceRow;
    });
}

export function filterBillingInvoiceRows(
  rows: BillingInvoiceRow[],
  filters: BillingInvoiceFilterInput
): BillingInvoiceRow[] {
  const query = filters.query.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesStatus = filters.invoiceStatus === "all" || row.status === filters.invoiceStatus;
    const matchesQuery =
      query.length === 0 ||
      row.id.toLowerCase().includes(query) ||
      row.accountId.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });
}

export function buildSupportIncidentRows(
  analyticsEvents: AnalyticsEvent[],
  crashReports: CrashReport[]
): SupportIncidentRow[] {
  const analyticsRows: SupportIncidentRow[] = analyticsEvents
    .filter((event) => shouldIncludeAnalyticsEvent(event))
    .map((event) => {
      const reason = asString(event.attributes.reason, "runtime_event");
      const payloadValidation = asString(event.attributes.payloadValidation, "ok");
      const correlationId = asString(event.attributes.correlationId, "-");
      const domain = asString(event.attributes.domain, "operations");
      const severity = resolveAnalyticsSeverity(reason, payloadValidation);
      return {
        id: `INC-${event.source.toUpperCase()}-${event.occurredAt}`,
        openedAt: event.occurredAt,
        domain,
        severity,
        state: severity === "high" ? "open" : "in_progress",
        summary: `${event.name} · ${reason}`,
        source: "analytics",
        correlationId
      } satisfies SupportIncidentRow;
    });

  const crashRows: SupportIncidentRow[] = crashReports.map((report) => ({
    id: `INC-CRASH-${report.source.toUpperCase()}-${report.occurredAt}`,
    openedAt: report.occurredAt,
    domain: "operations",
    severity: report.severity === "fatal" ? "high" : "medium",
    state: report.severity === "fatal" ? "open" : "in_progress",
    summary: report.message,
    source: "crash",
    correlationId: "-"
  }));

  return [...analyticsRows, ...crashRows].sort((left, right) =>
    right.openedAt.localeCompare(left.openedAt)
  );
}

export function applySupportIncidentStateOverrides(
  rows: SupportIncidentRow[],
  overrides: Record<string, SupportIncidentState>
): SupportIncidentRow[] {
  return rows.map((row) => ({
    ...row,
    state: overrides[row.id] ?? row.state
  }));
}

export function filterSupportIncidentRows(
  rows: SupportIncidentRow[],
  filters: SupportIncidentFilterInput
): SupportIncidentRow[] {
  const query = filters.query.trim().toLowerCase();
  const domain = filters.domain.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesState = filters.state === "all" || row.state === filters.state;
    const matchesSeverity = filters.severity === "all" || row.severity === filters.severity;
    const matchesDomain = domain.length === 0 || row.domain.toLowerCase().includes(domain);
    const matchesQuery =
      query.length === 0 ||
      row.id.toLowerCase().includes(query) ||
      row.summary.toLowerCase().includes(query) ||
      row.correlationId.toLowerCase().includes(query);
    return matchesState && matchesSeverity && matchesDomain && matchesQuery;
  });
}

function resolveBillingInvoiceStatus(
  index: number,
  sessionsCount: number,
  plansCount: number
): BillingInvoiceStatus {
  if (sessionsCount === 0) {
    return "overdue";
  }
  if (plansCount === 0 || index % 4 === 0) {
    return "draft";
  }
  if (index % 3 === 0) {
    return "paid";
  }
  return "open";
}

function resolveBillingPeriod(
  sessions: WorkoutSessionInput[],
  nutritionLogs: NutritionLog[],
  accountId: string
): string {
  const latestSession = sessions
    .filter((session) => session.userId === accountId)
    .map((session) => session.endedAt)
    .sort((left, right) => right.localeCompare(left))[0];
  if (typeof latestSession === "string") {
    return latestSession.slice(0, 7);
  }
  const latestNutrition = nutritionLogs
    .filter((log) => log.userId === accountId)
    .map((log) => log.date)
    .sort((left, right) => right.localeCompare(left))[0];
  if (typeof latestNutrition === "string") {
    return latestNutrition.slice(0, 7);
  }
  return "n/a";
}

function shouldIncludeAnalyticsEvent(event: AnalyticsEvent): boolean {
  const eventName = event.name.toLowerCase();
  if (eventName.includes("blocked") || eventName.includes("denied") || eventName.includes("error")) {
    return true;
  }
  const payloadValidation = asString(event.attributes.payloadValidation, "ok").toLowerCase();
  return payloadValidation !== "ok";
}

function resolveAnalyticsSeverity(
  reason: string,
  payloadValidation: string
): SupportIncidentSeverity {
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
