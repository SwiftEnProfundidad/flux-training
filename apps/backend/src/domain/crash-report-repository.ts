import type { CrashReport } from "@flux/contracts";

export interface CrashReportRepository {
  save(report: CrashReport): Promise<void>;
  listByUserId(userId: string): Promise<CrashReport[]>;
}
