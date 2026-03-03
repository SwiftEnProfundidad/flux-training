import type { DataExportRequest } from "@flux/contracts";
import type { DataExportRequestRepository } from "../domain/data-export-request-repository";
import { firestore } from "./firebase-app";

export class FirestoreDataExportRequestRepository implements DataExportRequestRepository {
  async save(request: DataExportRequest): Promise<void> {
    await firestore.collection("dataExportRequests").doc(request.id).set(request);
  }
}
