import { syncQueueItemSchema, type SyncQueueItem } from "@flux/contracts";
import type { OfflineQueueStore } from "../application/offline-sync-queue";

const storageKey = "flux_training_offline_queue";
let fallbackRecords: SyncQueueItem[] = [];

function readStoredQueue(): SyncQueueItem[] {
  if (typeof window === "undefined" || window.localStorage === undefined) {
    return fallbackRecords;
  }

  const rawValue = window.localStorage.getItem(storageKey);
  if (rawValue === null) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;
    return syncQueueItemSchema.array().parse(parsedValue);
  } catch {
    return [];
  }
}

function writeStoredQueue(items: SyncQueueItem[]): void {
  if (typeof window === "undefined" || window.localStorage === undefined) {
    fallbackRecords = items;
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(items));
}

class LocalStorageOfflineQueueStore implements OfflineQueueStore {
  async add(item: SyncQueueItem): Promise<void> {
    const records = readStoredQueue();
    records.push(item);
    writeStoredQueue(records);
  }

  async list(userId: string): Promise<SyncQueueItem[]> {
    return readStoredQueue().filter((record) => record.userId === userId);
  }

  async remove(ids: string[]): Promise<void> {
    const idSet = new Set(ids);
    const remaining = readStoredQueue().filter((record) => idSet.has(record.id) === false);
    writeStoredQueue(remaining);
  }
}

export const localStorageOfflineQueueStore: OfflineQueueStore =
  new LocalStorageOfflineQueueStore();
