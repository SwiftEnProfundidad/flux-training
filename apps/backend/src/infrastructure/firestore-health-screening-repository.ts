import type { HealthScreening } from "@flux/contracts";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";
import { firestore } from "./firebase-app";

export class FirestoreHealthScreeningRepository
  implements HealthScreeningRepository
{
  async save(screening: HealthScreening): Promise<void> {
    await firestore.collection("healthScreenings").add(screening);
  }
}

