import {
  type WorkoutSessionInput,
  workoutSessionInputSchema
} from "@flux/contracts";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

export class CreateWorkoutSessionUseCase {
  constructor(private readonly repository: WorkoutSessionRepository) {}

  async execute(payload: WorkoutSessionInput): Promise<WorkoutSessionInput> {
    const validated = workoutSessionInputSchema.parse(payload);
    await this.repository.save(validated);
    return validated;
  }
}

