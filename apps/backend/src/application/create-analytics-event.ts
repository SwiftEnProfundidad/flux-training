import { analyticsEventSchema, type AnalyticsEvent } from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";

export class CreateAnalyticsEventUseCase {
  constructor(private readonly repository: AnalyticsEventRepository) {}

  async execute(input: AnalyticsEvent): Promise<AnalyticsEvent> {
    const event = analyticsEventSchema.parse(input);
    await this.repository.save(event);
    return event;
  }
}
