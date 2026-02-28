import { describe, expect, it } from "vitest";
import { createTrainingPlanDraft } from "./training-plan";

describe("createTrainingPlanDraft", () => {
  it("creates valid training plan", () => {
    const plan = createTrainingPlanDraft({
      id: "plan-1",
      userId: "user-1",
      name: "Starter Plan",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [{ exerciseId: "goblet-squat", targetSets: 4, targetReps: 10 }]
        }
      ]
    });

    expect(plan.id).toBe("plan-1");
    expect(plan.days.length).toBe(1);
  });
});

