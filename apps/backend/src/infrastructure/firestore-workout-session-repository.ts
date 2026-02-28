import type { WorkoutSessionInput } from "@flux/contracts";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";
import { firestore } from "./firebase-app";

export class FirestoreWorkoutSessionRepository
  implements WorkoutSessionRepository
{
  async save(session: WorkoutSessionInput): Promise<void> {
    await firestore.collection("workoutSessions").add(session);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    const snapshot = await firestore
      .collection("workoutSessions")
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map((document) => document.data() as WorkoutSessionInput);
  }
}
