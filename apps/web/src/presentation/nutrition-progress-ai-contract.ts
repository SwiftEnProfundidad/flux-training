import type { AIRecommendation, NutritionLog, ProgressSummary } from "@flux/contracts";

export type NutritionProgressAIStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "error"
  | "offline"
  | "denied";

export type NutritionProgressAIScreenModel = {
  nutritionLogs: NutritionLog[];
  progressSummary: ProgressSummary | null;
  recommendations: AIRecommendation[];
  nutritionStatus: NutritionProgressAIStatus;
  progressStatus: NutritionProgressAIStatus;
  recommendationsStatus: NutritionProgressAIStatus;
};

export function createDefaultNutritionProgressAIScreenModel(): NutritionProgressAIScreenModel {
  return {
    nutritionLogs: [],
    progressSummary: null,
    recommendations: [],
    nutritionStatus: "idle",
    progressStatus: "idle",
    recommendationsStatus: "idle"
  };
}
