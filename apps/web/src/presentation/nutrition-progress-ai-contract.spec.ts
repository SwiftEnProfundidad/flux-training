import { describe, expect, it } from "vitest";
import { createDefaultNutritionProgressAIScreenModel } from "./nutrition-progress-ai-contract";

describe("nutrition progress ai screen contract", () => {
  it("creates default model in idle states", () => {
    expect(createDefaultNutritionProgressAIScreenModel()).toEqual({
      nutritionLogs: [],
      progressSummary: null,
      recommendations: [],
      nutritionStatus: "idle",
      progressStatus: "idle",
      recommendationsStatus: "idle"
    });
  });
});
