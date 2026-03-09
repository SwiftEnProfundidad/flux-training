import { describe, expect, it } from "vitest";
import type {
  AnalyticsEvent,
  CrashReport,
  DeniedAccessAudit
} from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";
import { ListStructuredLogsUseCase } from "./list-structured-logs";

class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
  constructor(private readonly records: AnalyticsEvent[]) {}

  async save(): Promise<void> {}

  async listByUserId(userId: string): Promise<AnalyticsEvent[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryCrashReportRepository implements CrashReportRepository {
  constructor(private readonly records: CrashReport[]) {}

  async save(): Promise<void> {}

  async listByUserId(userId: string): Promise<CrashReport[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryDeniedAccessAuditRepository implements DeniedAccessAuditRepository {
  constructor(private readonly records: DeniedAccessAudit[]) {}

  async save(): Promise<void> {}

  async listByUserId(userId: string): Promise<DeniedAccessAudit[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("ListStructuredLogsUseCase", () => {
  it("combines analytics crash and denied audit logs sorted by occurredAt desc", async () => {
    const useCase = new ListStructuredLogsUseCase(
      new InMemoryAnalyticsEventRepository([
        {
          userId: "user-1",
          name: "dashboard_action_blocked",
          source: "web",
          occurredAt: "2026-03-03T10:00:00.000Z",
          attributes: {
            domain: "operations",
            reason: "domain_denied",
            correlationId: "corr-evt-1"
          }
        }
      ]),
      new InMemoryCrashReportRepository([
        {
          userId: "user-1",
          source: "backend",
          message: "fatal worker crash",
          severity: "fatal",
          correlationId: "corr-crash-1",
          occurredAt: "2026-03-03T10:03:00.000Z"
        }
      ]),
      new InMemoryDeniedAccessAuditRepository([
        {
          id: "AUD-1",
          userId: "user-1",
          role: "athlete",
          domain: "training",
          action: "view",
          reason: "domain_denied",
          trigger: "domain_select",
          correlationId: "corr-audit-1",
          occurredAt: "2026-03-03T10:02:00.000Z"
        }
      ])
    );

    const logs = await useCase.execute("user-1");

    expect(logs).toHaveLength(3);
    expect(logs[0]?.category).toBe("crash");
    expect(logs[1]?.eventName).toBe("denied_access_audit");
    expect(logs[2]?.eventName).toBe("dashboard_action_blocked");
  });

  it("applies filters by level category source query and limit", async () => {
    const useCase = new ListStructuredLogsUseCase(
      new InMemoryAnalyticsEventRepository([
        {
          userId: "user-1",
          name: "dashboard_action_blocked",
          source: "web",
          occurredAt: "2026-03-03T10:00:00.000Z",
          attributes: {
            domain: "operations",
            reason: "domain_denied",
            correlationId: "corr-ops-1"
          }
        },
        {
          userId: "user-1",
          name: "dashboard_domain_changed",
          source: "web",
          occurredAt: "2026-03-03T10:01:00.000Z",
          attributes: {
            domain: "training",
            reason: "navigated",
            correlationId: "corr-trn-1"
          }
        }
      ]),
      new InMemoryCrashReportRepository([]),
      new InMemoryDeniedAccessAuditRepository([])
    );

    const logs = await useCase.execute("user-1", {
      level: "warning",
      category: "access",
      source: "web",
      query: "blocked",
      limit: 1
    });

    expect(logs).toHaveLength(1);
    expect(logs[0]?.eventName).toBe("dashboard_action_blocked");
  });

  it("rejects missing user id", async () => {
    const useCase = new ListStructuredLogsUseCase(
      new InMemoryAnalyticsEventRepository([]),
      new InMemoryCrashReportRepository([]),
      new InMemoryDeniedAccessAuditRepository([])
    );

    await expect(useCase.execute("   ")).rejects.toThrowError("missing_user_id");
  });
});
