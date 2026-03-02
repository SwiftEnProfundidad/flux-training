import { afterEach, describe, expect, it, vi } from "vitest";
import type { SyncQueueProcessInput } from "@flux/contracts";
import { apiOfflineSyncGateway } from "./sync-client";

const sampleInput: SyncQueueProcessInput = {
  userId: "user-1",
  items: [
    {
      id: "queue-2",
      userId: "user-1",
      enqueuedAt: "2026-03-02T09:00:00.000Z",
      action: {
        type: "create_workout_session",
        payload: {
          userId: "user-1",
          planId: "plan-1",
          startedAt: "2026-03-02T08:00:00.000Z",
          endedAt: "2026-03-02T08:30:00.000Z",
          exercises: [
            {
              exerciseId: "squat",
              sets: [{ reps: 8, loadKg: 60, rpe: 8 }]
            }
          ]
        }
      }
    },
    {
      id: "queue-1",
      userId: "user-1",
      enqueuedAt: "2026-03-02T08:00:00.000Z",
      action: {
        type: "create_nutrition_log",
        payload: {
          userId: "user-1",
          date: "2026-03-02",
          calories: 2200,
          proteinGrams: 150,
          carbsGrams: 230,
          fatsGrams: 70
        }
      }
    }
  ]
};

describe("apiOfflineSyncGateway", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends deterministic idempotency header based on user and queued item ids", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          result: {
            acceptedIds: ["queue-1", "queue-2"],
            rejected: []
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      )
    );

    await apiOfflineSyncGateway.process(sampleInput);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [, options] = fetchSpy.mock.calls[0] ?? [];
    const headers = options?.headers as Record<string, string>;
    expect(headers["x-idempotency-key"]).toBe("sync:user-1:queue-1,queue-2");
  });

  it("returns idempotency metadata when backend provides it", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          result: {
            acceptedIds: ["queue-1"],
            rejected: []
          },
          idempotency: {
            key: "sync:user-1:queue-1",
            replayed: true,
            ttlSeconds: 300
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      )
    );

    const result = await apiOfflineSyncGateway.process(sampleInput);

    expect(result.acceptedIds).toEqual(["queue-1"]);
    expect(result.idempotency).toEqual({
      key: "sync:user-1:queue-1",
      replayed: true,
      ttlSeconds: 300
    });
  });
});
