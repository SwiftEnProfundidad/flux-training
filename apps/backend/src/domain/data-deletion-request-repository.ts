import type { DataDeletionRequest } from "@flux/contracts";

export interface DataDeletionRequestRepository {
  save(request: DataDeletionRequest): Promise<void>;
}
