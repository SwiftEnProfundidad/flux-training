import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "@flux/contracts";
import { CreateAnalyticsEventUseCase } from "./create-analytics-event";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";

class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
  records: AnalyticsEvent[] = [];

  async save(event: AnalyticsEvent): Promise<void> {
    this.records.push(event);
  }

  async listByUserId(userId: string): Promise<AnalyticsEvent[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("CreateAnalyticsEventUseCase", () => {
  it("stores analytics event", async () => {
    const repository = new InMemoryAnalyticsEventRepository();
    const useCase = new CreateAnalyticsEventUseCase(repository);

    await useCase.execute({
      userId: "user-1",
      name: "screen_view",
      source: "web",
      occurredAt: "2026-02-27T10:00:00.000Z",
      attributes: { screen: "dashboard" }
    });

    expect(repository.records).toHaveLength(1);
    expect(repository.records[0]?.name).toBe("screen_view");
  });
});
