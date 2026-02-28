import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "@flux/contracts";
import { ListAnalyticsEventsUseCase } from "./list-analytics-events";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";

class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
  constructor(private readonly records: AnalyticsEvent[]) {}

  async save(event: AnalyticsEvent): Promise<void> {
    this.records.push(event);
  }

  async listByUserId(userId: string): Promise<AnalyticsEvent[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("ListAnalyticsEventsUseCase", () => {
  it("lists user analytics events", async () => {
    const useCase = new ListAnalyticsEventsUseCase(
      new InMemoryAnalyticsEventRepository([
        {
          userId: "user-1",
          name: "screen_view",
          source: "web",
          occurredAt: "2026-02-27T10:00:00.000Z",
          attributes: { screen: "dashboard" }
        },
        {
          userId: "user-2",
          name: "button_click",
          source: "ios",
          occurredAt: "2026-02-27T10:01:00.000Z",
          attributes: {}
        }
      ])
    );

    const events = await useCase.execute("user-1");

    expect(events).toHaveLength(1);
    expect(events[0]?.name).toBe("screen_view");
  });

  it("throws when user id is empty", async () => {
    const useCase = new ListAnalyticsEventsUseCase(
      new InMemoryAnalyticsEventRepository([])
    );

    await expect(useCase.execute("")).rejects.toThrowError("missing_user_id");
  });
});
