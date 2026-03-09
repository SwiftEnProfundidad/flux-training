import { describe, expect, it } from "vitest";
import type { DeniedAccessAudit } from "@flux/contracts";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";
import { RecordDeniedAccessAuditUseCase } from "./record-denied-access-audit";

class InMemoryDeniedAccessAuditRepository implements DeniedAccessAuditRepository {
  records: DeniedAccessAudit[] = [];

  async save(audit: DeniedAccessAudit): Promise<void> {
    this.records.push(audit);
  }

  async listByUserId(userId: string): Promise<DeniedAccessAudit[]> {
    return this.records.filter((audit) => audit.userId === userId);
  }
}

describe("RecordDeniedAccessAuditUseCase", () => {
  it("persists denied access audit with generated metadata", async () => {
    const repository = new InMemoryDeniedAccessAuditRepository();
    const useCase = new RecordDeniedAccessAuditUseCase(
      repository,
      () => "audit-fixed-id",
      () => "2026-03-03T09:00:00.000Z"
    );

    const audit = await useCase.execute({
      userId: "demo-user",
      role: "coach",
      domain: "onboarding",
      action: "view",
      reason: "domain_denied",
      trigger: "domain_select",
      correlationId: "corr-1"
    });

    expect(audit.id).toBe("audit-fixed-id");
    expect(audit.occurredAt).toBe("2026-03-03T09:00:00.000Z");
    expect(repository.records).toHaveLength(1);
    expect(repository.records[0]?.reason).toBe("domain_denied");
  });
});
