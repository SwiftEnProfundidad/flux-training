import { describe, expect, it } from "vitest";
import { ListDataRetentionPoliciesUseCase } from "./list-data-retention-policies";

describe("ListDataRetentionPoliciesUseCase", () => {
  it("returns enterprise retention policies for all regulated domains", () => {
    const useCase = new ListDataRetentionPoliciesUseCase();

    const policies = useCase.execute();

    expect(policies).toHaveLength(5);
    expect(policies.find((item) => item.domain === "legal")?.retentionDays).toBe(1825);
    expect(policies.every((item) => item.legalBasis.length > 0)).toBe(true);
  });
});
