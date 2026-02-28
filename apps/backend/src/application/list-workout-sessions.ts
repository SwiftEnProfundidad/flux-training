import type { WorkoutSessionInput } from "@flux/contracts";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

export class ListWorkoutSessionsUseCase {
  constructor(private readonly repository: WorkoutSessionRepository) {}

  async execute(userId: string, planId?: string): Promise<WorkoutSessionInput[]> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }
    const sessions = await this.repository.listByUserId(userId);
    if (planId === undefined || planId.length === 0) {
      return sessions;
    }
    return sessions.filter((session) => session.planId === planId);
  }
}

