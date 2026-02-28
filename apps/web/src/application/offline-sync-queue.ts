import {
  syncQueueItemSchema,
  syncQueueProcessInputSchema,
  syncQueueProcessResultSchema,
  type NutritionLog,
  type SyncQueueItem,
  type SyncQueueProcessInput,
  type SyncQueueProcessResult,
  type TrainingPlan,
  type WorkoutSessionInput
} from "@flux/contracts";

export interface OfflineQueueStore {
  add(item: SyncQueueItem): Promise<void>;
  list(userId: string): Promise<SyncQueueItem[]>;
  remove(ids: string[]): Promise<void>;
}

export interface OfflineSyncGateway {
  process(input: SyncQueueProcessInput): Promise<SyncQueueProcessResult>;
}

export class OfflineSyncQueueUseCase {
  constructor(
    private readonly store: OfflineQueueStore,
    private readonly gateway: OfflineSyncGateway,
    private readonly now: () => Date = () => new Date(),
    private readonly idFactory: () => string = () => crypto.randomUUID()
  ) {}

  async queueTrainingPlan(userId: string, payload: Omit<TrainingPlan, "createdAt">): Promise<void> {
    const item = syncQueueItemSchema.parse({
      id: this.idFactory(),
      userId,
      enqueuedAt: this.now().toISOString(),
      action: {
        type: "create_training_plan",
        payload
      }
    });
    await this.store.add(item);
  }

  async queueWorkoutSession(userId: string, payload: WorkoutSessionInput): Promise<void> {
    const item = syncQueueItemSchema.parse({
      id: this.idFactory(),
      userId,
      enqueuedAt: this.now().toISOString(),
      action: {
        type: "create_workout_session",
        payload
      }
    });
    await this.store.add(item);
  }

  async queueNutritionLog(userId: string, payload: NutritionLog): Promise<void> {
    const item = syncQueueItemSchema.parse({
      id: this.idFactory(),
      userId,
      enqueuedAt: this.now().toISOString(),
      action: {
        type: "create_nutrition_log",
        payload
      }
    });
    await this.store.add(item);
  }

  async listPending(userId: string): Promise<SyncQueueItem[]> {
    return this.store.list(userId);
  }

  async syncPending(userId: string): Promise<SyncQueueProcessResult> {
    const items = await this.store.list(userId);
    const input = syncQueueProcessInputSchema.parse({ userId, items });
    if (input.items.length === 0) {
      return syncQueueProcessResultSchema.parse({ acceptedIds: [], rejected: [] });
    }

    const result = syncQueueProcessResultSchema.parse(
      await this.gateway.process(input)
    );

    if (result.acceptedIds.length > 0) {
      await this.store.remove(result.acceptedIds);
    }

    return result;
  }
}
