import { describe, expect, it } from "vitest";
import type { NutritionLog, RoleCapabilities, TrainingPlan, WorkoutSessionInput } from "@flux/contracts";
import {
  buildGovernancePrincipals,
  buildRoleCapabilityCoverage,
  filterGovernancePrincipals,
  isAdminRole
} from "./admin-governance";

const plans: TrainingPlan[] = [
  {
    id: "plan-1",
    userId: "athlete-a",
    name: "Starter",
    weeks: 4,
    days: [{ dayIndex: 1, exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 6 }] }],
    createdAt: "2026-03-02T10:00:00.000Z"
  }
];

const sessions: WorkoutSessionInput[] = [
  {
    userId: "athlete-a",
    planId: "plan-1",
    startedAt: "2026-03-01T09:00:00.000Z",
    endedAt: "2026-03-01T09:45:00.000Z",
    exercises: [{ exerciseId: "squat", sets: [{ reps: 6, loadKg: 90, rpe: 8 }] }]
  }
];

const nutritionLogs: NutritionLog[] = [
  {
    userId: "athlete-a",
    date: "2026-03-01",
    calories: 2200,
    proteinGrams: 150,
    carbsGrams: 230,
    fatsGrams: 70
  }
];

describe("admin governance", () => {
  it("builds principals list combining operator and activity users", () => {
    const principals = buildGovernancePrincipals({
      operatorId: "demo-user",
      activeRole: "coach",
      plans,
      sessions,
      nutritionLogs,
      assignedRolesByPrincipal: { "athlete-a": "athlete" }
    });

    expect(principals.map((item) => item.userId)).toEqual(["athlete-a", "demo-user"]);
    expect(principals.find((item) => item.userId === "demo-user")?.assignedRole).toBe("coach");
    expect(principals.find((item) => item.userId === "athlete-a")?.source).toBe("activity");
  });

  it("filters principals by query and role", () => {
    const principals = buildGovernancePrincipals({
      operatorId: "demo-user",
      activeRole: "admin",
      plans,
      sessions,
      nutritionLogs,
      assignedRolesByPrincipal: { "athlete-a": "athlete" }
    });

    expect(filterGovernancePrincipals(principals, "athlete", "all")).toHaveLength(1);
    expect(filterGovernancePrincipals(principals, "", "admin")).toHaveLength(1);
  });

  it("builds role capability coverage rows", () => {
    const capabilitiesByRole: Partial<Record<"athlete" | "coach" | "admin", RoleCapabilities>> = {
      athlete: {
        role: "athlete",
        allowedDomains: ["all", "training"],
        issuedAt: "2026-03-02T10:00:00.000Z"
      },
      coach: {
        role: "coach",
        allowedDomains: ["all", "training", "nutrition"],
        issuedAt: "2026-03-02T10:00:00.000Z"
      }
    };

    const coverage = buildRoleCapabilityCoverage(capabilitiesByRole);
    expect(coverage).toHaveLength(3);
    expect(coverage.find((item) => item.role === "athlete")?.allowedDomainsCount).toBe(2);
    expect(coverage.find((item) => item.role === "admin")?.allowedDomainsCount).toBe(0);
  });

  it("detects admin role", () => {
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("coach")).toBe(false);
  });
});
