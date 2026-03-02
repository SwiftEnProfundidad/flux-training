import {
  analyticsEventSchema,
  crashReportSchema,
  observabilitySummarySchema,
  type AnalyticsEvent,
  type CrashReport,
  type ObservabilitySummary
} from "@flux/contracts";

export interface ObservabilityGateway {
  createAnalyticsEvent(event: AnalyticsEvent): Promise<AnalyticsEvent>;
  listAnalyticsEvents(userId: string): Promise<AnalyticsEvent[]>;
  createCrashReport(report: CrashReport): Promise<CrashReport>;
  listCrashReports(userId: string): Promise<CrashReport[]>;
  listObservabilitySummary(userId: string): Promise<ObservabilitySummary>;
}

export class ManageObservabilityUseCase {
  constructor(private readonly gateway: ObservabilityGateway) {}

  async createAnalyticsEvent(event: AnalyticsEvent): Promise<AnalyticsEvent> {
    const payload = await this.gateway.createAnalyticsEvent(event);
    return analyticsEventSchema.parse(payload);
  }

  async listAnalyticsEvents(userId: string): Promise<AnalyticsEvent[]> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }
    const events = await this.gateway.listAnalyticsEvents(userId);
    return analyticsEventSchema.array().parse(events);
  }

  async createCrashReport(report: CrashReport): Promise<CrashReport> {
    const payload = await this.gateway.createCrashReport(report);
    return crashReportSchema.parse(payload);
  }

  async listCrashReports(userId: string): Promise<CrashReport[]> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }
    const reports = await this.gateway.listCrashReports(userId);
    return crashReportSchema.array().parse(reports);
  }

  async listObservabilitySummary(userId: string): Promise<ObservabilitySummary> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }
    const summary = await this.gateway.listObservabilitySummary(userId);
    return observabilitySummarySchema.parse(summary);
  }
}
