import type { DataExportRequest } from "@flux/contracts";

export interface DataExportRequestRepository {
  save(request: DataExportRequest): Promise<void>;
}
