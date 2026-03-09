import type { SyncQueueProcessInput, SyncQueueProcessResult } from "@flux/contracts";
import type { OfflineSyncGateway } from "../application/offline-sync-queue";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiOfflineSyncGateway implements OfflineSyncGateway {
  async process(
    input: SyncQueueProcessInput
  ): Promise<SyncQueueProcessResult & { idempotency?: unknown }> {
    const idempotencyKey = buildIdempotencyKey(input);
    const response = await fetch("/api/processSyncQueue", {
      method: "POST",
      headers: {
        ...createApiHeaders(undefined, true),
        "x-idempotency-key": idempotencyKey
      },
      body: JSON.stringify(input)
    });

    await assertApiResponse(response, "process_sync_queue_failed");

    const payload = (await response.json()) as {
      result: SyncQueueProcessResult;
      idempotency?: unknown;
    };
    return {
      ...payload.result,
      idempotency: payload.idempotency
    };
  }
}

export const apiOfflineSyncGateway: OfflineSyncGateway = new ApiOfflineSyncGateway();

function buildIdempotencyKey(input: SyncQueueProcessInput): string {
  const itemIds = input.items.map((item) => item.id).sort().join(",");
  return `sync:${input.userId}:${itemIds}`;
}
