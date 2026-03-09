import type { Goal } from "@flux/contracts";

export type AuthScreenStatus = "idle" | "loading" | "success" | "error" | "offline" | "denied";
export type OnboardingScreenStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "offline"
  | "denied";

export type AuthScreenModel = {
  titleKey: "authTitle";
  subtitleKey: "authSubtitle";
  email: string;
  password: string;
  rememberMe: boolean;
  status: AuthScreenStatus;
};

export type OnboardingScreenModel = {
  titleKey: "onboardingTitle";
  subtitleKey: "onboardingSubtitle";
  displayName: string;
  age: number;
  heightCm: number;
  weightKg: number;
  availableDaysPerWeek: number;
  goal: Goal;
  parQ1: boolean;
  parQ2: boolean;
  privacyPolicyAccepted: boolean;
  termsAccepted: boolean;
  medicalDisclaimerAccepted: boolean;
  status: OnboardingScreenStatus;
};

export function createDefaultAuthScreenModel(): AuthScreenModel {
  return {
    titleKey: "authTitle",
    subtitleKey: "authSubtitle",
    email: "",
    password: "",
    rememberMe: false,
    status: "idle"
  };
}

export function createDefaultOnboardingScreenModel(): OnboardingScreenModel {
  return {
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
  };
}
