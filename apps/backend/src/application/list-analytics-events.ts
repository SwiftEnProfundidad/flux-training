import { analyticsEventSchema, type AnalyticsEvent } from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";

export class ListAnalyticsEventsUseCase {
  constructor(private readonly repository: AnalyticsEventRepository) {}

  async execute(userId: string): Promise<AnalyticsEvent[]> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }
    const events = await this.repository.listByUserId(userId);
    return analyticsEventSchema.array().parse(events);
  }
}
