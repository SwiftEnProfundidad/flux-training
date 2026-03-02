import { describe, expect, it } from "vitest";
import { createDefaultDailyTrainingVideoScreenModel } from "./daily-training-video-contract";

describe("daily training video screen contract", () => {
  it("creates default model in idle states", () => {
    expect(createDefaultDailyTrainingVideoScreenModel()).toEqual({
      planName: "",
      selectedPlanId: "",
      selectedExercise: "goblet-squat",
      videoLocale: "es-ES",
      sessions: [],
      trainingStatus: "idle",
      sessionStatus: "idle",
      videoStatus: "idle"
    });
  });
});
