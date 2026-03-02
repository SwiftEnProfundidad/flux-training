import { createHash } from "node:crypto";
import {
  forensicAuditExportRequestSchema,
  forensicAuditExportSchema,
  type ForensicAuditExport,
  type ForensicAuditExportRequest
} from "@flux/contracts";
import { ListActivityLogUseCase } from "./list-activity-log";
import { ListStructuredLogsUseCase } from "./list-structured-logs";

function resolveExportId(userId: string, generatedAt: string): string {
  const timestamp = Date.parse(generatedAt);
  return `forensic-${userId}-${Number.isNaN(timestamp) ? Date.now() : timestamp}`;
}

function resolveChecksum(payload: {
  request: ForensicAuditExportRequest;
  structuredLogsCount: number;
  activityLogCount: number;
  generatedAt: string;
}): string {
  return createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex")
    .slice(0, 16);
}

export class ExportForensicAuditUseCase {
  constructor(
    private readonly listStructuredLogsUseCase: ListStructuredLogsUseCase,
    private readonly listActivityLogUseCase: ListActivityLogUseCase,
    private readonly nowFactory: () => string = () => new Date().toISOString()
  ) {}

  async execute(request: ForensicAuditExportRequest): Promise<ForensicAuditExport> {
    const parsedRequest = forensicAuditExportRequestSchema.parse(request);
    const generatedAt = this.nowFactory();

    const [structuredLogs, activityLog] = await Promise.all([
      parsedRequest.includeStructuredLogs
        ? this.listStructuredLogsUseCase.execute(parsedRequest.userId, {
            fromDate: parsedRequest.fromDate,
            toDate: parsedRequest.toDate,
            limit: parsedRequest.limit
          })
        : Promise.resolve([]),
      parsedRequest.includeActivityLog
        ? this.listActivityLogUseCase.execute(parsedRequest.userId, {
            fromDate: parsedRequest.fromDate,
            toDate: parsedRequest.toDate,
            limit: parsedRequest.limit
          })
        : Promise.resolve([])
    ]);

    const id = resolveExportId(parsedRequest.userId, generatedAt);
    const rowCount = structuredLogs.length + activityLog.length;
    const checksum = resolveChecksum({
      request: parsedRequest,
      structuredLogsCount: structuredLogs.length,
      activityLogCount: activityLog.length,
      generatedAt
    });

    return forensicAuditExportSchema.parse({
      id,
      userId: parsedRequest.userId,
      format: parsedRequest.format,
      status: "completed",
      generatedAt,
      rowCount,
      checksum,
      downloadUrl: `https://forensics.flux.training/exports/${id}.${parsedRequest.format}`,
      fromDate: parsedRequest.fromDate ?? null,
      toDate: parsedRequest.toDate ?? null
    });
  }
}
