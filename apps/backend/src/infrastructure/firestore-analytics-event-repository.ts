import type { AnalyticsEvent } from "@flux/contracts";
import type { AnalyticsEventRepository } from "../domain/analytics-event-repository";
import { firestore } from "./firebase-app";

export class FirestoreAnalyticsEventRepository implements AnalyticsEventRepository {
  async save(event: AnalyticsEvent): Promise<void> {
    await firestore.collection("analyticsEvents").add(event);
  }

  async listByUserId(userId: string): Promise<AnalyticsEvent[]> {
    const snapshot = await firestore
      .collection("analyticsEvents")
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map((document) => document.data() as AnalyticsEvent);
  }
}
