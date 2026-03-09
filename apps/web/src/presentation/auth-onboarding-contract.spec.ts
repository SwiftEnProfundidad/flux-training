import { describe, expect, it } from "vitest";
import {
  createDefaultAuthScreenModel,
  createDefaultOnboardingScreenModel
} from "./auth-onboarding-contract";

describe("auth onboarding screen contract", () => {
  it("creates default auth model in idle state", () => {
    expect(createDefaultAuthScreenModel()).toEqual({
      titleKey: "authTitle",
      subtitleKey: "authSubtitle",
      email: "",
      password: "",
      rememberMe: false,
      status: "idle"
    });
  });

  it("creates default onboarding model in idle state", () => {
    expect(createDefaultOnboardingScreenModel()).toEqual({
      titleKey: "onboardingTitle",
      subtitleKey: "onboardingSubtitle",
      displayName: "",
      age: 0,
      heightCm: 0,
      weightKg: 0,
      availableDaysPerWeek: 0,
      goal: "recomposition",
      parQ1: false,
      parQ2: false,
      privacyPolicyAccepted: false,
      termsAccepted: false,
      medicalDisclaimerAccepted: false,
      status: "idle"
    });
  });
});
