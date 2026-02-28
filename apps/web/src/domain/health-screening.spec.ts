import { describe, expect, it } from "vitest";
import { evaluateHealthScreening } from "./health-screening";

describe("evaluateHealthScreening", () => {
  it("assigns moderate risk when any response is true", () => {
    const screening = evaluateHealthScreening(
      "user-1",
      {
        displayName: "Juan",
        age: 35,
        heightCm: 178,
        weightKg: 84,
        availableDaysPerWeek: 4,
        equipment: ["dumbbells"],
        injuries: []
      },
      [
        { questionId: "parq-1", answer: false },
        { questionId: "parq-2", answer: true }
      ]
    );

    expect(screening.risk).toBe("moderate");
  });
});

