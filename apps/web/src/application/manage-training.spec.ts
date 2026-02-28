import { describe, expect, it } from "vitest";
import type { ExerciseVideo } from "@flux/contracts";
import type { TrainingGateway } from "./manage-training";
import { ManageTrainingUseCase } from "./manage-training";

class InMemoryTrainingGateway implements TrainingGateway {
  private readonly plans = [
    {
      id: "plan-1",
      userId: "user-1",
      name: "Starter Plan",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [{ exerciseId: "squat", targetSets: 4, targetReps: 10 }]
        }
      ],
      createdAt: "2026-02-25T13:00:00.000Z"
    }
  ];
  private readonly sessions = [
    {
      userId: "user-1",
      planId: "plan-1",
      startedAt: "2026-02-25T08:00:00.000Z",
      endedAt: "2026-02-25T09:00:00.000Z",
      exercises: [{ exerciseId: "squat", sets: [{ reps: 8, loadKg: 60, rpe: 8 }] }]
    }
  ];
  private readonly videos: ExerciseVideo[] = [
    {
      id: "video-goblet-squat-es",
      exerciseId: "goblet-squat",
      title: "Sentadilla Goblet",
      coach: "Flux Coach",
      difficulty: "beginner",
      durationSeconds: 180,
      videoUrl: "https://cdn.flux.training/videos/goblet-squat-es.mp4",
      thumbnailUrl: "https://cdn.flux.training/videos/goblet-squat-es.jpg",
      tags: ["piernas", "tecnica"],
      locale: "es-ES"
    }
  ];

  async createTrainingPlan(input: Omit<(typeof this.plans)[number], "createdAt">) {
    const createdPlan = {
      ...input,
      createdAt: "2026-02-25T13:00:00.000Z"
    };
    this.plans.push(createdPlan);
    return createdPlan;
  }

  async listTrainingPlans(userId: string) {
    return this.plans.filter((plan) => plan.userId === userId);
  }

  async createWorkoutSession(input: (typeof this.sessions)[number]) {
    this.sessions.push(input);
    return input;
  }

  async listWorkoutSessions(userId: string, planId?: string) {
    return this.sessions.filter(
      (session) => session.userId === userId && (planId === undefined || session.planId === planId)
    );
  }

  async listExerciseVideos(exerciseId: string, locale: string) {
    return this.videos.filter(
      (video) =>
        video.exerciseId === exerciseId && (video.locale === locale || video.locale === "en-US")
    );
  }
}

describe("ManageTrainingUseCase", () => {
  it("lists plans for a user", async () => {
    const useCase = new ManageTrainingUseCase(new InMemoryTrainingGateway());

    const plans = await useCase.listTrainingPlans("user-1");

    expect(plans).toHaveLength(1);
    expect(plans[0]?.id).toBe("plan-1");
  });

  it("lists sessions filtered by plan", async () => {
    const useCase = new ManageTrainingUseCase(new InMemoryTrainingGateway());

    const sessions = await useCase.listWorkoutSessions("user-1", "plan-1");

    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.planId).toBe("plan-1");
  });

  it("lists exercise videos for selected exercise and locale", async () => {
    const useCase = new ManageTrainingUseCase(new InMemoryTrainingGateway());

    const videos = await useCase.listExerciseVideos("goblet-squat", "es-ES");

    expect(videos).toHaveLength(1);
    expect(videos[0]?.locale).toBe("es-ES");
  });
});
