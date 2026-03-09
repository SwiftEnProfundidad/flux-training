import { deniedAccessAuditSchema, type DeniedAccessAudit } from "@flux/contracts";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";

export class ListDeniedAccessAuditsUseCase {
  constructor(private readonly repository: DeniedAccessAuditRepository) {}

  async execute(userId: string): Promise<DeniedAccessAudit[]> {
    const normalizedUserId = userId.trim();
    if (normalizedUserId.length === 0) {
      throw new Error("missing_user_id");
    }
    const audits = await this.repository.listByUserId(normalizedUserId);
    return deniedAccessAuditSchema.array().parse(audits);
  }
}
