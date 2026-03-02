import {
  deniedAccessAuditInputSchema,
  deniedAccessAuditSchema,
  type DeniedAccessAudit,
  type DeniedAccessAuditInput
} from "@flux/contracts";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";

type UUIDFactory = () => string;
type TimestampFactory = () => string;

function createAuditId(): string {
  return `audit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export class RecordDeniedAccessAuditUseCase {
  constructor(
    private readonly repository: DeniedAccessAuditRepository,
    private readonly idFactory: UUIDFactory = createAuditId,
    private readonly nowFactory: TimestampFactory = () => new Date().toISOString()
  ) {}

  async execute(inputRaw: DeniedAccessAuditInput): Promise<DeniedAccessAudit> {
    const input = deniedAccessAuditInputSchema.parse(inputRaw);
    const audit = deniedAccessAuditSchema.parse({
      ...input,
      id: this.idFactory(),
      occurredAt: this.nowFactory()
    });
    await this.repository.save(audit);
    return audit;
  }
}
