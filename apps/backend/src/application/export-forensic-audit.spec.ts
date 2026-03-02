import { describe, expect, it } from "vitest";
import type {
  AnalyticsEvent,
  CrashReport,
  DeniedAccessAudit
} from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";
import { ExportForensicAuditUseCase } from "./export-forensic-audit";
import { ListActivityLogUseCase } from "./list-activity-log";
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

describe("ExportForensicAuditUseCase", () => {
  it("exports structured logs and activity log metadata", async () => {
    const analyticsRepository = new InMemoryAnalyticsEventRepository([
      {
        userId: "user-1",
        name: "dashboard_action_blocked",
        source: "web",
        occurredAt: "2026-03-03T10:00:00.000Z",
        attributes: {
          role: "athlete",
          domain: "training",
          backendRoute: "training/view",
          reason: "domain_denied",
          correlationId: "corr-evt-1"
        }
      }
    ]);
    const crashRepository = new InMemoryCrashReportRepository([
      {
        userId: "user-1",
        source: "backend",
        message: "fatal worker crash",
        severity: "fatal",
        correlationId: "corr-crash-1",
        occurredAt: "2026-03-03T10:01:00.000Z"
      }
    ]);
    const deniedAccessRepository = new InMemoryDeniedAccessAuditRepository([
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
    ]);

    const useCase = new ExportForensicAuditUseCase(
      new ListStructuredLogsUseCase(
        analyticsRepository,
        crashRepository,
        deniedAccessRepository
      ),
      new ListActivityLogUseCase(
        analyticsRepository,
        deniedAccessRepository,
        crashRepository
      ),
      () => "2026-03-03T11:00:00.000Z"
    );

    const result = await useCase.execute({
      userId: "user-1",
      format: "csv",
      fromDate: "2026-03-03T09:00:00.000Z",
      toDate: "2026-03-03T12:00:00.000Z",
      includeStructuredLogs: true,
      includeActivityLog: true
    });

    expect(result.status).toBe("completed");
    expect(result.rowCount).toBeGreaterThan(0);
    expect(result.downloadUrl.endsWith(".csv")).toBe(true);
    expect(result.checksum.length).toBe(16);
  });

  it("supports exports without structured logs", async () => {
    const analyticsRepository = new InMemoryAnalyticsEventRepository([
      {
        userId: "user-2",
        name: "dashboard_role_changed",
        source: "web",
        occurredAt: "2026-03-03T10:00:00.000Z",
        attributes: {
          role: "admin",
          domain: "operations",
          backendRoute: "role-capabilities",
          reason: "role switched",
          correlationId: "corr-evt-2"
        }
      }
    ]);
    const crashRepository = new InMemoryCrashReportRepository([]);
    const deniedAccessRepository = new InMemoryDeniedAccessAuditRepository([]);

    const useCase = new ExportForensicAuditUseCase(
      new ListStructuredLogsUseCase(
        analyticsRepository,
        crashRepository,
        deniedAccessRepository
      ),
      new ListActivityLogUseCase(
        analyticsRepository,
        deniedAccessRepository,
        crashRepository
      ),
      () => "2026-03-03T11:00:00.000Z"
    );

    const result = await useCase.execute({
      userId: "user-2",
      format: "json",
      includeStructuredLogs: false,
      includeActivityLog: true
    });

    expect(result.format).toBe("json");
    expect(result.downloadUrl.endsWith(".json")).toBe(true);
    expect(result.rowCount).toBe(1);
  });
});
