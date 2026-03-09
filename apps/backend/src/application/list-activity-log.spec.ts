import { describe, expect, it } from "vitest";
import type {
  AnalyticsEvent,
  CrashReport,
  DeniedAccessAudit
} from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";
import { ListActivityLogUseCase } from "./list-activity-log";

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

describe("ListActivityLogUseCase", () => {
  it("builds activity log entries from events denied audits and crashes", async () => {
    const useCase = new ListActivityLogUseCase(
      new InMemoryAnalyticsEventRepository([
        {
          userId: "user-1",
          name: "dashboard_role_changed",
          source: "web",
          occurredAt: "2026-03-03T10:00:00.000Z",
          attributes: {
            role: "admin",
            domain: "operations",
            backendRoute: "role-capabilities",
            reason: "role switched",
            correlationId: "corr-role-1"
          }
        },
        {
          userId: "user-1",
          name: "dashboard_action_blocked",
          source: "web",
          occurredAt: "2026-03-03T10:01:00.000Z",
          attributes: {
            role: "athlete",
            domain: "training",
            backendRoute: "training/view",
            reason: "domain_denied",
            correlationId: "corr-denied-1"
          }
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
      ])
    );

    const entries = await useCase.execute("user-1");

    expect(entries).toHaveLength(4);
    expect(entries[0]?.action).toBe("crash_reported");
    expect(entries[1]?.action).toBe("access_denied");
    expect(entries.some((entry) => entry.action === "role_changed")).toBe(true);
    expect(entries.some((entry) => entry.action === "action_blocked")).toBe(true);
  });

  it("applies action outcome source query and limit filters", async () => {
    const useCase = new ListActivityLogUseCase(
      new InMemoryAnalyticsEventRepository([
        {
          userId: "user-1",
          name: "dashboard_action_blocked",
          source: "web",
          occurredAt: "2026-03-03T10:01:00.000Z",
          attributes: {
            role: "athlete",
            domain: "training",
            backendRoute: "training/view",
            reason: "domain_denied",
            correlationId: "corr-denied-1"
          }
        },
        {
          userId: "user-1",
          name: "dashboard_role_changed",
          source: "web",
          occurredAt: "2026-03-03T10:00:00.000Z",
          attributes: {
            role: "admin",
            domain: "operations",
            backendRoute: "role-capabilities",
            reason: "role switched",
            correlationId: "corr-role-1"
          }
        }
      ]),
      new InMemoryDeniedAccessAuditRepository([]),
      new InMemoryCrashReportRepository([])
    );

    const entries = await useCase.execute("user-1", {
      action: "action_blocked",
      outcome: "denied",
      source: "web",
      query: "training",
      limit: 1
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]?.action).toBe("action_blocked");
    expect(entries[0]?.outcome).toBe("denied");
  });

  it("rejects missing user id", async () => {
    const useCase = new ListActivityLogUseCase(
      new InMemoryAnalyticsEventRepository([]),
      new InMemoryDeniedAccessAuditRepository([]),
      new InMemoryCrashReportRepository([])
    );

    await expect(useCase.execute(" ")).rejects.toThrowError("missing_user_id");
  });
});
