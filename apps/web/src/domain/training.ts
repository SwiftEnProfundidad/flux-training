import {
  type WorkoutSessionInput,
  workoutSessionInputSchema
} from "@flux/contracts";

export function validateWorkoutSessionInput(
  input: WorkoutSessionInput
): WorkoutSessionInput {
  return workoutSessionInputSchema.parse(input);
}

