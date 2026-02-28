import type { SyncQueueProcessInput, SyncQueueProcessResult } from "@flux/contracts";
import type { OfflineSyncGateway } from "../application/offline-sync-queue";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiOfflineSyncGateway implements OfflineSyncGateway {
  async process(input: SyncQueueProcessInput): Promise<SyncQueueProcessResult> {
    const response = await fetch("/api/processSyncQueue", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(input)
    });

    await assertApiResponse(response, "process_sync_queue_failed");

    const payload = (await response.json()) as { result: SyncQueueProcessResult };
    return payload.result;
  }
}

export const apiOfflineSyncGateway: OfflineSyncGateway = new ApiOfflineSyncGateway();
