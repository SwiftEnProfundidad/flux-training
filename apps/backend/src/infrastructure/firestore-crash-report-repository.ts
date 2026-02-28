import type { CrashReport } from "@flux/contracts";
import type { CrashReportRepository } from "../domain/crash-report-repository";
import { firestore } from "./firebase-app";

export class FirestoreCrashReportRepository implements CrashReportRepository {
  async save(report: CrashReport): Promise<void> {
    await firestore.collection("crashReports").add(report);
  }

  async listByUserId(userId: string): Promise<CrashReport[]> {
    const snapshot = await firestore
      .collection("crashReports")
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map((document) => document.data() as CrashReport);
  }
}
