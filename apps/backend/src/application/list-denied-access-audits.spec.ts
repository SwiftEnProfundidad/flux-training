import { describe, expect, it } from "vitest";
import type { DeniedAccessAudit } from "@flux/contracts";
import type { DeniedAccessAuditRepository } from "../domain/denied-access-audit-repository";
import { ListDeniedAccessAuditsUseCase } from "./list-denied-access-audits";

class InMemoryDeniedAccessAuditRepository implements DeniedAccessAuditRepository {
  constructor(private readonly records: DeniedAccessAudit[]) {}

  async save(): Promise<void> {}

  async listByUserId(userId: string): Promise<DeniedAccessAudit[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

describe("ListDeniedAccessAuditsUseCase", () => {
  it("lists denied access audit rows by user", async () => {
    const useCase = new ListDeniedAccessAuditsUseCase(
      new InMemoryDeniedAccessAuditRepository([
        {
          id: "audit-1",
          userId: "demo-user",
          role: "coach",
          domain: "onboarding",
          action: "view",
          reason: "domain_denied",
          trigger: "domain_select",
          correlationId: "corr-1",
          occurredAt: "2026-03-03T09:00:00.000Z"
        },
        {
          id: "audit-2",
          userId: "other-user",
          role: "athlete",
          domain: "training",
          action: "view",
          reason: "ownership_required",
          trigger: "recover",
          correlationId: "corr-2",
          occurredAt: "2026-03-03T09:05:00.000Z"
        }
      ])
    );

    const audits = await useCase.execute("demo-user");

    expect(audits).toHaveLength(1);
    expect(audits[0]?.id).toBe("audit-1");
  });

  it("rejects empty user id", async () => {
    const useCase = new ListDeniedAccessAuditsUseCase(
      new InMemoryDeniedAccessAuditRepository([])
    );

    await expect(useCase.execute("")).rejects.toThrow("missing_user_id");
  });
});
