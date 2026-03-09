import { describe, expect, it } from "vitest";
import type {
  SyncQueueItem,
  SyncQueueProcessInput,
  SyncQueueProcessResult
} from "@flux/contracts";
import type { OfflineQueueStore, OfflineSyncGateway } from "./offline-sync-queue";
import { OfflineSyncQueueUseCase } from "./offline-sync-queue";

class InMemoryOfflineQueueStore implements OfflineQueueStore {
  private readonly records: SyncQueueItem[] = [];

  async add(item: SyncQueueItem): Promise<void> {
    this.records.push(item);
  }

  async list(userId: string): Promise<SyncQueueItem[]> {
    return this.records.filter((record) => record.userId === userId);
  }

  async remove(ids: string[]): Promise<void> {
    const idSet = new Set(ids);
    const remaining = this.records.filter((record) => idSet.has(record.id) === false);
    this.records.splice(0, this.records.length, ...remaining);
  }
}

class InMemoryOfflineSyncGateway implements OfflineSyncGateway {
  async process(
    input: SyncQueueProcessInput
  ): Promise<SyncQueueProcessResult & { idempotency?: unknown }> {
    return {
      acceptedIds: input.items.map((item) => item.id),
      rejected: []
    };
  }
}

describe("OfflineSyncQueueUseCase", () => {
  it("queues actions and flushes accepted items", async () => {
    const queueStore = new InMemoryOfflineQueueStore();
    const useCase = new OfflineSyncQueueUseCase(
      queueStore,
      new InMemoryOfflineSyncGateway(),
      () => new Date("2026-02-27T10:00:00.000Z"),
      (() => {
        let index = 0;
        return () => {
          index += 1;
          return `queue-${index}`;
        };
      })()
    );

    await useCase.queueTrainingPlan("user-1", {
      id: "plan-1",
      userId: "user-1",
      name: "Starter Plan",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 8 }]
        }
      ]
    });
    await useCase.queueWorkoutSession("user-1", {
      userId: "user-1",
      planId: "plan-1",
      startedAt: "2026-02-27T08:00:00.000Z",
      endedAt: "2026-02-27T08:30:00.000Z",
      exercises: [
        {
          exerciseId: "squat",
          sets: [{ reps: 8, loadKg: 60, rpe: 8 }]
        }
      ]
    });

    const pendingBeforeSync = await useCase.listPending("user-1");
    expect(pendingBeforeSync).toHaveLength(2);

    const syncResult = await useCase.syncPending("user-1");

    expect(syncResult.acceptedIds).toEqual(["queue-1", "queue-2"]);
    expect(syncResult.rejected).toEqual([]);
    expect(syncResult.idempotency).toBeNull();
    expect(await useCase.listPending("user-1")).toHaveLength(0);
  });

  it("returns empty result when there are no queued items", async () => {
    const useCase = new OfflineSyncQueueUseCase(
      new InMemoryOfflineQueueStore(),
      new InMemoryOfflineSyncGateway()
    );

    const result = await useCase.syncPending("user-1");

    expect(result.acceptedIds).toEqual([]);
    expect(result.rejected).toEqual([]);
    expect(result.idempotency).toBeNull();
  });

  it("exposes idempotency metadata returned by gateway", async () => {
    class IdempotentGateway implements OfflineSyncGateway {
      async process(
        input: SyncQueueProcessInput
      ): Promise<SyncQueueProcessResult & { idempotency?: unknown }> {
        return {
          acceptedIds: input.items.map((item) => item.id),
          rejected: [],
          idempotency: {
            key: "sync:user-1:queue-1",
            replayed: false,
            ttlSeconds: 300
          }
        };
      }
    }

    const queueStore = new InMemoryOfflineQueueStore();
    const useCase = new OfflineSyncQueueUseCase(
      queueStore,
      new IdempotentGateway(),
      () => new Date("2026-02-27T10:00:00.000Z"),
      (() => {
        let index = 0;
        return () => {
          index += 1;
          return `queue-${index}`;
        };
      })()
    );

    await useCase.queueNutritionLog("user-1", {
      userId: "user-1",
      date: "2026-02-27",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    });

    const result = await useCase.syncPending("user-1");

    expect(result.acceptedIds).toEqual(["queue-1"]);
    expect(result.idempotency).toEqual({
      key: "sync:user-1:queue-1",
      replayed: false,
      ttlSeconds: 300
    });
  });
});
