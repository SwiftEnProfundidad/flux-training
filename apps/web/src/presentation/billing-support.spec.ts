import { describe, expect, it } from "vitest";
import type {
  AnalyticsEvent,
  CrashReport,
  NutritionLog,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";
import {
  applySupportIncidentStateOverrides,
  buildBillingInvoiceRows,
  buildSupportIncidentRows,
  filterBillingInvoiceRows,
  filterSupportIncidentRows
} from "./billing-support";

const plans: TrainingPlan[] = [
  {
    id: "plan-1",
    userId: "athlete-a",
    name: "Hypertrophy",
    weeks: 6,
    days: [{ dayIndex: 1, exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 8 }] }],
    createdAt: "2026-03-01T09:00:00.000Z"
  }
];

const sessions: WorkoutSessionInput[] = [
  {
    userId: "athlete-a",
    planId: "plan-1",
    startedAt: "2026-03-02T09:00:00.000Z",
    endedAt: "2026-03-02T10:00:00.000Z",
    exercises: [{ exerciseId: "squat", sets: [{ reps: 8, loadKg: 90, rpe: 8 }] }]
  }
];

const nutritionLogs: NutritionLog[] = [
  {
    userId: "athlete-a",
    date: "2026-03-02",
    calories: 2200,
    proteinGrams: 150,
    carbsGrams: 230,
    fatsGrams: 70
  }
];

const analyticsEvents: AnalyticsEvent[] = [
  {
    userId: "athlete-a",
    name: "dashboard_action_blocked",
    source: "web",
    occurredAt: "2026-03-02T10:10:00.000Z",
    attributes: {
      domain: "operations",
      reason: "domain_denied",
      payloadValidation: "ok",
      correlationId: "corr-1"
    }
  }
];

const crashReports: CrashReport[] = [
  {
    userId: "athlete-a",
    source: "ios",
    message: "fatal runtime",
    stackTrace: "frame-a",
    severity: "fatal",
    occurredAt: "2026-03-02T10:12:00.000Z"
  }
];

describe("billing support", () => {
  it("builds billing invoice rows with deterministic status and amounts", () => {
    const rows = buildBillingInvoiceRows(plans, sessions, nutritionLogs);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.id).toBe("INV-0001");
    expect(rows[0]?.status).toBe("draft");
    expect(rows[0]?.period).toBe("2026-03");
    expect(rows[0]?.amountEUR).toBeGreaterThan(0);
  });

  it("filters billing rows by query and status", () => {
    const rows = buildBillingInvoiceRows(plans, sessions, nutritionLogs);

    const filtered = filterBillingInvoiceRows(rows, {
      query: "athlete-a",
      invoiceStatus: "draft"
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.accountId).toBe("athlete-a");
  });

  it("builds support incidents and applies state overrides", () => {
    const rows = buildSupportIncidentRows(analyticsEvents, crashReports);

    expect(rows).toHaveLength(2);
    expect(rows[0]?.severity).toBe("high");

    const overridden = applySupportIncidentStateOverrides(rows, {
      [rows[0]!.id]: "resolved"
    });

    expect(overridden[0]?.state).toBe("resolved");
  });

  it("filters support incidents by severity, state and query", () => {
    const rows = buildSupportIncidentRows(analyticsEvents, crashReports);

    const filtered = filterSupportIncidentRows(rows, {
      query: "denied",
      domain: "operations",
      state: "open",
      severity: "high"
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.source).toBe("analytics");
  });
});
