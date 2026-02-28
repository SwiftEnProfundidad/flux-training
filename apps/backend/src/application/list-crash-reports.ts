import { crashReportSchema, type CrashReport } from "@flux/contracts";
import type { CrashReportRepository } from "../domain/crash-report-repository";

export class ListCrashReportsUseCase {
  constructor(private readonly repository: CrashReportRepository) {}

  async execute(userId: string): Promise<CrashReport[]> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }
    const reports = await this.repository.listByUserId(userId);
    return crashReportSchema.array().parse(reports);
  }
}
