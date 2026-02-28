import { describe, expect, it } from "vitest";
import { validateWorkoutSessionInput } from "./training";

describe("validateWorkoutSessionInput", () => {
  it("returns valid payload", () => {
    const payload = validateWorkoutSessionInput({
      userId: "u1",
      planId: "p1",
      startedAt: "2026-02-25T08:00:00.000Z",
      endedAt: "2026-02-25T09:00:00.000Z",
      exercises: [
        {
          exerciseId: "bench-press",
          sets: [{ reps: 8, loadKg: 50, rpe: 8 }]
        }
      ]
    });

    expect(payload.userId).toBe("u1");
    expect(payload.exercises.length).toBe(1);
  });
});

