import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, CrashReport } from "@flux/contracts";
import {
  buildAuditTimelineRows,
  exportAuditTimelineRowsToCSV,
  filterAuditTimelineRows
} from "./audit-compliance";

const analyticsEvents: AnalyticsEvent[] = [
  {
    userId: "demo-user",
    name: "dashboard_action_blocked",
    source: "web",
    occurredAt: "2026-03-02T10:00:00.000Z",
    attributes: {
      domain: "operations",
      correlationId: "c-1",
      reason: "domain_denied"
    }
  },
  {
    userId: "demo-user",
    name: "governance_bulk_role_assignment_saved",
    source: "web",
    occurredAt: "2026-03-02T10:10:00.000Z",
    attributes: {
      domain: "operations",
      correlationId: "c-2",
      payloadValidation: "ok"
    }
  }
];

const crashReports: CrashReport[] = [
  {
    userId: "demo-user",
    source: "ios",
    message: "fatal crash",
    stackTrace: "Stack line 1",
    severity: "fatal",
    occurredAt: "2026-03-02T09:50:00.000Z"
  }
];

describe("audit compliance", () => {
  it("builds timeline rows sorted by occurredAt descending", () => {
    const rows = buildAuditTimelineRows(analyticsEvents, crashReports);

    expect(rows).toHaveLength(3);
    expect(rows[0]?.name).toBe("governance_bulk_role_assignment_saved");
    expect(rows[1]?.name).toBe("dashboard_action_blocked");
    expect(rows[2]?.name).toBe("fatal crash");
    expect(rows[2]?.category).toBe("crash");
  });

  it("filters timeline rows by source/category/severity/domain/query", () => {
    const rows = buildAuditTimelineRows(analyticsEvents, crashReports);

    const filtered = filterAuditTimelineRows(rows, {
      query: "blocked",
      source: "web",
      category: "analytics",
      severity: "all",
      domain: "operations"
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.name).toBe("dashboard_action_blocked");
  });

  it("exports rows as csv with escaped summary", () => {
    const rows = buildAuditTimelineRows(analyticsEvents, crashReports);
    const csv = exportAuditTimelineRowsToCSV(rows);

    expect(csv.split("\n")[0]).toBe(
      "occurredAt,source,category,severity,name,domain,correlationId,summary"
    );
    expect(csv).toContain("dashboard_action_blocked");
    expect(csv).toContain("governance_bulk_role_assignment_saved");
  });
});
