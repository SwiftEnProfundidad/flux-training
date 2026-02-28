import { describe, expect, it } from "vitest";
import type { WorkoutSessionInput } from "@flux/contracts";
import { CreateWorkoutSessionUseCase } from "./create-workout-session";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

class InMemoryWorkoutSessionRepository implements WorkoutSessionRepository {
  sessions: WorkoutSessionInput[] = [];

  async save(session: WorkoutSessionInput): Promise<void> {
    this.sessions.push(session);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    return this.sessions.filter((session) => session.userId === userId);
  }
}

describe("CreateWorkoutSessionUseCase", () => {
  it("stores a valid workout session", async () => {
    const repository = new InMemoryWorkoutSessionRepository();
    const useCase = new CreateWorkoutSessionUseCase(repository);

    await useCase.execute({
      userId: "u1",
      planId: "p1",
      startedAt: "2026-02-25T08:00:00.000Z",
      endedAt: "2026-02-25T09:00:00.000Z",
      exercises: [
        {
          exerciseId: "deadlift",
          sets: [{ reps: 5, loadKg: 80, rpe: 8 }]
        }
      ]
    });

    expect(repository.sessions).toHaveLength(1);
  });
});
