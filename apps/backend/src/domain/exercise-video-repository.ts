import type { ExerciseVideo } from "@flux/contracts";

export interface ExerciseVideoRepository {
  listByExerciseID(exerciseID: string, locale: string): Promise<ExerciseVideo[]>;
}
