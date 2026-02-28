import type { ExerciseVideo } from "@flux/contracts";
import type { ExerciseVideoRepository } from "../domain/exercise-video-repository";

const catalog: ExerciseVideo[] = [
  {
    id: "video-goblet-squat-es",
    exerciseId: "goblet-squat",
    title: "Sentadilla Goblet: tecnica base",
    coach: "Flux Coach",
    difficulty: "beginner",
    durationSeconds: 182,
    videoUrl: "https://cdn.flux.training/videos/goblet-squat-es.mp4",
    thumbnailUrl: "https://cdn.flux.training/videos/goblet-squat-es.jpg",
    tags: ["piernas", "movilidad", "tecnica"],
    locale: "es-ES"
  },
  {
    id: "video-goblet-squat-en",
    exerciseId: "goblet-squat",
    title: "Goblet Squat Form Fundamentals",
    coach: "Flux Coach",
    difficulty: "beginner",
    durationSeconds: 176,
    videoUrl: "https://cdn.flux.training/videos/goblet-squat-en.mp4",
    thumbnailUrl: "https://cdn.flux.training/videos/goblet-squat-en.jpg",
    tags: ["legs", "form", "mobility"],
    locale: "en-US"
  },
  {
    id: "video-bench-press-es",
    exerciseId: "bench-press",
    title: "Press banca: control y estabilidad",
    coach: "Flux Coach",
    difficulty: "intermediate",
    durationSeconds: 166,
    videoUrl: "https://cdn.flux.training/videos/bench-press-es.mp4",
    thumbnailUrl: "https://cdn.flux.training/videos/bench-press-es.jpg",
    tags: ["pecho", "fuerza", "estabilidad"],
    locale: "es-ES"
  },
  {
    id: "video-bench-press-en",
    exerciseId: "bench-press",
    title: "Bench Press Setup and Drive",
    coach: "Flux Coach",
    difficulty: "intermediate",
    durationSeconds: 158,
    videoUrl: "https://cdn.flux.training/videos/bench-press-en.mp4",
    thumbnailUrl: "https://cdn.flux.training/videos/bench-press-en.jpg",
    tags: ["chest", "strength", "setup"],
    locale: "en-US"
  }
];

export class StaticExerciseVideoRepository implements ExerciseVideoRepository {
  async listByExerciseID(exerciseID: string, locale: string): Promise<ExerciseVideo[]> {
    const filtered = catalog.filter(
      (video) =>
        video.exerciseId === exerciseID && (video.locale === locale || video.locale === "en-US")
    );

    return filtered.sort((left, right) => {
      if (left.locale === locale && right.locale !== locale) {
        return -1;
      }
      if (left.locale !== locale && right.locale === locale) {
        return 1;
      }
      return left.id.localeCompare(right.id);
    });
  }
}
