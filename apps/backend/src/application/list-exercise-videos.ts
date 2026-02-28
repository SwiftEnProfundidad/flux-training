import { exerciseVideoSchema, type ExerciseVideo } from "@flux/contracts";
import type { ExerciseVideoRepository } from "../domain/exercise-video-repository";

type Input = {
  userId: string;
  exerciseId: string;
  locale: string;
};

export class ListExerciseVideosUseCase {
  constructor(private readonly repository: ExerciseVideoRepository) {}

  async execute(input: Input): Promise<ExerciseVideo[]> {
    if (input.userId.length === 0) {
      throw new Error("missing_user_id");
    }
    if (input.exerciseId.length === 0) {
      throw new Error("missing_exercise_id");
    }
    if (input.locale.length === 0) {
      throw new Error("missing_locale");
    }

    const videos = await this.repository.listByExerciseID(input.exerciseId, input.locale);
    return exerciseVideoSchema.array().parse(videos);
  }
}
