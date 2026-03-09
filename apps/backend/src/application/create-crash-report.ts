import { crashReportSchema, type CrashReport } from "@flux/contracts";
import type { CrashReportRepository } from "../domain/crash-report-repository";

export class CreateCrashReportUseCase {
  constructor(private readonly repository: CrashReportRepository) {}

  async execute(input: CrashReport): Promise<CrashReport> {
    const parsedInput = crashReportSchema.parse(input);
    const normalizedReport = crashReportSchema.parse({
      ...parsedInput,
      correlationId:
        typeof parsedInput.correlationId === "string" &&
        parsedInput.correlationId.trim().length > 0
          ? parsedInput.correlationId
          : `corr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    });
    await this.repository.save(normalizedReport);
    return normalizedReport;
  }
}
