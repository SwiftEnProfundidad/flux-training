import type { WorkoutSessionInput } from "@flux/contracts";

export interface WorkoutSessionRepository {
  save(session: WorkoutSessionInput): Promise<void>;
  listByUserId(userId: string): Promise<WorkoutSessionInput[]>;
}
