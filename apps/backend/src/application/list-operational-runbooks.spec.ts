import { describe, expect, it } from "vitest";
import { ListOperationalRunbooksUseCase } from "./list-operational-runbooks";

describe("ListOperationalRunbooksUseCase", () => {
  it("returns runbooks for all operational alert codes", () => {
    const useCase = new ListOperationalRunbooksUseCase(
      () => "2026-03-03T12:00:00.000Z"
    );

    const runbooks = useCase.execute();

    expect(runbooks.length).toBe(5);
    expect(runbooks.map((item) => item.alertCode)).toEqual([
      "fatal_crash_slo_breach",
      "denied_access_spike",
      "blocked_action_spike",
      "canonical_coverage_drop",
      "high_incident_backlog"
    ]);
    expect(runbooks.every((item) => item.steps.length > 0)).toBe(true);
    expect(runbooks.every((item) => item.updatedAt === "2026-03-03T12:00:00.000Z")).toBe(true);
  });
});
