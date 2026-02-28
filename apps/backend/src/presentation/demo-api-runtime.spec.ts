import { describe, expect, it } from "vitest";
import { createDemoApiRuntime } from "./demo-api-runtime";

describe("DemoApiRuntime", () => {
  it("returns loaded videos and recommendations for dashboard", async () => {
    const runtime = createDemoApiRuntime();

    const videos = await runtime.listExerciseVideos({
      userId: "demo-user",
      exerciseId: "goblet-squat",
      locale: "es-ES"
    });

    const recommendations = await runtime.listAIRecommendations({
      userId: "demo-user",
      goal: "recomposition",
      pendingQueueCount: 1,
      daysSinceLastWorkout: 3,
      recentCompletionRate: 0.5,
      locale: "es-ES"
    });

    expect(videos.length).toBeGreaterThan(0);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]?.priority).toBe("high");
  });

  it("persists training and nutrition flows in local runtime", async () => {
    const runtime = createDemoApiRuntime();

    const createdPlan = await runtime.createTrainingPlan({
      id: "plan-1",
      userId: "demo-user",
      name: "Starter",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [{ exerciseId: "goblet-squat", targetSets: 4, targetReps: 10 }]
        }
      ]
    });

    await runtime.createWorkoutSession({
      userId: "demo-user",
      planId: createdPlan.id,
      startedAt: "2026-03-01T08:00:00.000Z",
      endedAt: "2026-03-01T08:35:00.000Z",
      exercises: [
        { exerciseId: "goblet-squat", sets: [{ reps: 10, loadKg: 22, rpe: 7 }] }
      ]
    });

    await runtime.createNutritionLog({
      userId: "demo-user",
      date: "2026-03-01",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    });

    const summary = await runtime.getProgressSummary("demo-user");

    expect(summary.workoutSessionsCount).toBe(1);
    expect(summary.nutritionLogsCount).toBe(1);
  });
});
