import { crashReportSchema, type CrashReport } from "@flux/contracts";
import type { CrashReportRepository } from "../domain/crash-report-repository";

export class CreateCrashReportUseCase {
  constructor(private readonly repository: CrashReportRepository) {}

  async execute(input: CrashReport): Promise<CrashReport> {
    const report = crashReportSchema.parse(input);
    await this.repository.save(report);
    return report;
  }
}
