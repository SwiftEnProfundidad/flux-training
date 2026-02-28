import type { AnalyticsEvent } from "@flux/contracts";

export interface AnalyticsEventRepository {
  save(event: AnalyticsEvent): Promise<void>;
  listByUserId(userId: string): Promise<AnalyticsEvent[]>;
}
