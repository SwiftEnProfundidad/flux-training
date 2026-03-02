import {
  onboardingSubmissionInputSchema,
  nutritionLogSchema,
  syncQueueProcessInputSchema,
  workoutSessionInputSchema,
  type Goal
} from "@flux/contracts";
import type { DashboardDomain } from "./dashboard-domains";

export type DomainPayloadValidation = {
  contract: string;
  status: "valid" | "invalid";
  missingFields: string;
};

export type DomainPayloadValidationInput = {
  domain: DashboardDomain;
  userId: string;
  goal: Goal;
  displayName: string;
  age: number;
  heightCm: number;
  weightKg: number;
  availableDaysPerWeek: number;
  parQ1: boolean;
  parQ2: boolean;
  selectedPlanId: string;
  selectedExerciseId: string;
  nutritionDate: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
};

export function resolveBlockedActionRoute(domain: DashboardDomain): string {
  switch (domain) {
    case "onboarding":
      return "/api/completeOnboarding";
    case "training":
      return "/api/createWorkoutSession";
    case "nutrition":
      return "/api/createNutritionLog";
    case "progress":
      return "/api/getProgressSummary";
    case "operations":
      return "/api/processSyncQueue";
    case "all":
      return "/api/health";
    default:
      return "/api/health";
  }
}

export function resolveDomainPayloadValidation(
  input: DomainPayloadValidationInput
): DomainPayloadValidation {
  switch (input.domain) {
    case "onboarding": {
      const result = onboardingSubmissionInputSchema.safeParse({
        userId: input.userId,
        goal: input.goal,
        onboardingProfile: {
          displayName: input.displayName,
          age: input.age,
          heightCm: input.heightCm,
          weightKg: input.weightKg,
          availableDaysPerWeek: input.availableDaysPerWeek,
          equipment: ["dumbbells"],
          injuries: []
        },
        responses: [
          { questionId: "parq-1", answer: input.parQ1 },
          { questionId: "parq-2", answer: input.parQ2 }
        ]
      });
      if (result.success) {
        return {
          contract: "onboardingSubmissionInputSchema",
          status: "valid",
          missingFields: "none"
        };
      }
      return {
        contract: "onboardingSubmissionInputSchema",
        status: "invalid",
        missingFields: formatIssuePaths(result.error.issues)
      };
    }
    case "training": {
      const result = workoutSessionInputSchema.safeParse({
        userId: input.userId,
        planId: input.selectedPlanId,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        exercises: [
          {
            exerciseId: input.selectedExerciseId,
            sets: [{ reps: 12, loadKg: 20, rpe: 7 }]
          }
        ]
      });
      if (result.success) {
        return {
          contract: "workoutSessionInputSchema",
          status: "valid",
          missingFields: "none"
        };
      }
      return {
        contract: "workoutSessionInputSchema",
        status: "invalid",
        missingFields: formatIssuePaths(result.error.issues)
      };
    }
    case "nutrition": {
      const result = nutritionLogSchema.safeParse({
        userId: input.userId,
        date: input.nutritionDate,
        calories: input.calories,
        proteinGrams: input.proteinGrams,
        carbsGrams: input.carbsGrams,
        fatsGrams: input.fatsGrams
      });
      if (result.success) {
        return {
          contract: "nutritionLogSchema",
          status: "valid",
          missingFields: "none"
        };
      }
      return {
        contract: "nutritionLogSchema",
        status: "invalid",
        missingFields: formatIssuePaths(result.error.issues)
      };
    }
    case "progress":
      return {
        contract: "getProgressSummaryQuery",
        status: input.userId.trim().length > 0 ? "valid" : "invalid",
        missingFields: input.userId.trim().length > 0 ? "none" : "userId"
      };
    case "operations": {
      const result = syncQueueProcessInputSchema.safeParse({
        userId: input.userId,
        items: []
      });
      if (result.success) {
        return {
          contract: "syncQueueProcessInputSchema",
          status: "valid",
          missingFields: "none"
        };
      }
      return {
        contract: "syncQueueProcessInputSchema",
        status: "invalid",
        missingFields: formatIssuePaths(result.error.issues)
      };
    }
    case "all":
      return {
        contract: "healthCheck",
        status: "valid",
        missingFields: "none"
      };
    default:
      return {
        contract: "unknown",
        status: "invalid",
        missingFields: "domain"
      };
  }
}

function formatIssuePaths(
  issues: ReadonlyArray<{ path: ReadonlyArray<string | number> }>
): string {
  const fields = issues
    .map((issue) => issue.path.join("."))
    .filter((value) => value.length > 0);
  if (fields.length === 0) {
    return "unknown";
  }
  return Array.from(new Set(fields)).join(",");
}
