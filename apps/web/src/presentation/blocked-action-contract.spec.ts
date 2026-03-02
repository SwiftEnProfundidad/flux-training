import { describe, expect, it } from "vitest";
import {
  resolveBlockedActionRoute,
  resolveDomainPayloadValidation,
  type DomainPayloadValidationInput
} from "./blocked-action-contract";

const baseInput: DomainPayloadValidationInput = {
  domain: "onboarding",
  userId: "demo-user",
  goal: "recomposition",
  displayName: "Juan",
  age: 35,
  heightCm: 178,
  weightKg: 84,
  availableDaysPerWeek: 4,
  parQ1: false,
  parQ2: false,
  selectedPlanId: "plan-1",
  selectedExerciseId: "goblet-squat",
  nutritionDate: "2026-02-26",
  calories: 2200,
  proteinGrams: 150,
  carbsGrams: 230,
  fatsGrams: 70
};

describe("blocked action contract", () => {
  it("maps runtime domain to backend route", () => {
    expect(resolveBlockedActionRoute("onboarding")).toBe("/api/completeOnboarding");
    expect(resolveBlockedActionRoute("training")).toBe("/api/createWorkoutSession");
    expect(resolveBlockedActionRoute("nutrition")).toBe("/api/createNutritionLog");
    expect(resolveBlockedActionRoute("progress")).toBe("/api/getProgressSummary");
    expect(resolveBlockedActionRoute("operations")).toBe("/api/processSyncQueue");
    expect(resolveBlockedActionRoute("all")).toBe("/api/health");
  });

  it("returns invalid payload validation when onboarding data is incomplete", () => {
    const validation = resolveDomainPayloadValidation({
      ...baseInput,
      domain: "onboarding",
      displayName: ""
    });

    expect(validation.contract).toBe("onboardingSubmissionInputSchema");
    expect(validation.status).toBe("invalid");
    expect(validation.missingFields).toContain("onboardingProfile.displayName");
  });

  it("returns valid payload validation when training payload matches backend contract", () => {
    const validation = resolveDomainPayloadValidation({
      ...baseInput,
      domain: "training"
    });

    expect(validation.contract).toBe("workoutSessionInputSchema");
    expect(validation.status).toBe("valid");
    expect(validation.missingFields).toBe("none");
  });
});
