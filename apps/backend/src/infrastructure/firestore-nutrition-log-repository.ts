import type { NutritionLog } from "@flux/contracts";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import { firestore } from "./firebase-app";

export class FirestoreNutritionLogRepository implements NutritionLogRepository {
  async save(log: NutritionLog): Promise<void> {
    await firestore.collection("nutritionLogs").add(log);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    const snapshot = await firestore
      .collection("nutritionLogs")
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map((document) => document.data() as NutritionLog);
  }
}

