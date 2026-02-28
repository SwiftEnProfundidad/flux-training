import { describe, expect, it } from "vitest";
import type { ExerciseVideo } from "@flux/contracts";
import { ListExerciseVideosUseCase } from "./list-exercise-videos";
import type { ExerciseVideoRepository } from "../domain/exercise-video-repository";

class InMemoryExerciseVideoRepository implements ExerciseVideoRepository {
  constructor(private readonly videos: ExerciseVideo[]) {}

  async listByExerciseID(exerciseID: string, locale: string): Promise<ExerciseVideo[]> {
    return this.videos.filter(
      (video) => video.exerciseId === exerciseID && (video.locale === locale || video.locale === "en-US")
    );
  }
}

describe("ListExerciseVideosUseCase", () => {
  it("returns locale-aware exercise videos", async () => {
    const repository = new InMemoryExerciseVideoRepository([
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
      },
      {
        id: "video-goblet-squat-en",
        exerciseId: "goblet-squat",
        title: "Goblet Squat",
        coach: "Flux Coach",
        difficulty: "beginner",
        durationSeconds: 170,
        videoUrl: "https://cdn.flux.training/videos/goblet-squat-en.mp4",
        thumbnailUrl: "https://cdn.flux.training/videos/goblet-squat-en.jpg",
        tags: ["legs", "form"],
        locale: "en-US"
      },
      {
        id: "video-bench-press-es",
        exerciseId: "bench-press",
        title: "Press banca",
        coach: "Flux Coach",
        difficulty: "intermediate",
        durationSeconds: 160,
        videoUrl: "https://cdn.flux.training/videos/bench-press-es.mp4",
        thumbnailUrl: "https://cdn.flux.training/videos/bench-press-es.jpg",
        tags: ["pecho", "fuerza"],
        locale: "es-ES"
      }
    ]);
    const useCase = new ListExerciseVideosUseCase(repository);

    const videos = await useCase.execute({
      userId: "user-1",
      exerciseId: "goblet-squat",
      locale: "es-ES"
    });

    expect(videos).toHaveLength(2);
    expect(videos[0]?.exerciseId).toBe("goblet-squat");
    expect(videos.some((video) => video.locale === "es-ES")).toBe(true);
  });
});
