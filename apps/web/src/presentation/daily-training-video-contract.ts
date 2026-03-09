import type { WorkoutSessionInput } from "@flux/contracts";

export type DailyTrainingVideoStatus =
  | "idle"
  | "loading"
  | "saved"
  | "loaded"
  | "queued"
  | "error"
  | "offline"
  | "denied";

export type DailyTrainingVideoScreenModel = {
  planName: string;
  selectedPlanId: string;
  selectedExercise: string;
  videoLocale: string;
  sessions: WorkoutSessionInput[];
  trainingStatus: DailyTrainingVideoStatus;
  sessionStatus: DailyTrainingVideoStatus;
  videoStatus: DailyTrainingVideoStatus;
};

export function createDefaultDailyTrainingVideoScreenModel(): DailyTrainingVideoScreenModel {
  return {
    planName: "",
    selectedPlanId: "",
    selectedExercise: "goblet-squat",
    videoLocale: "es-ES",
    sessions: [],
    trainingStatus: "idle",
    sessionStatus: "idle",
    videoStatus: "idle"
  };
}
