import type { TrainingPlan } from "@flux/contracts";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import { firestore } from "./firebase-app";

export class FirestoreTrainingPlanRepository implements TrainingPlanRepository {
  async save(plan: TrainingPlan): Promise<void> {
    await firestore.collection("trainingPlans").doc(plan.id).set(plan);
  }

  async listByUserId(userId: string): Promise<TrainingPlan[]> {
    const snapshot = await firestore
      .collection("trainingPlans")
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map((document) => document.data() as TrainingPlan);
  }
}
