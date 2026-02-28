import type { DataDeletionRequest } from "@flux/contracts";
import type { DataDeletionRequestRepository } from "../domain/data-deletion-request-repository";
import { firestore } from "./firebase-app";

export class FirestoreDataDeletionRequestRepository
  implements DataDeletionRequestRepository
{
  async save(request: DataDeletionRequest): Promise<void> {
    await firestore.collection("dataDeletionRequests").add(request);
  }
}
