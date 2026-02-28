import { describe, expect, it } from "vitest";
import type { WorkoutSessionInput } from "@flux/contracts";
import { ListWorkoutSessionsUseCase } from "./list-workout-sessions";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

class InMemoryWorkoutSessionRepository implements WorkoutSessionRepository {
  constructor(private readonly sessions: WorkoutSessionInput[]) {}

  async save(session: WorkoutSessionInput): Promise<void> {
    this.sessions.push(session);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    return this.sessions.filter((session) => session.userId === userId);
  }
}

describe("ListWorkoutSessionsUseCase", () => {
  it("returns sessions filtered by plan when provided", async () => {
    const repository = new InMemoryWorkoutSessionRepository([
      {
        userId: "user-1",
        planId: "plan-1",
        startedAt: "2026-02-25T08:00:00.000Z",
        endedAt: "2026-02-25T09:00:00.000Z",
        exercises: [
          {
            exerciseId: "squat",
            sets: [{ reps: 8, loadKg: 60, rpe: 8 }]
          }
        ]
      },
      {
        userId: "user-1",
        planId: "plan-2",
        startedAt: "2026-02-26T08:00:00.000Z",
        endedAt: "2026-02-26T09:00:00.000Z",
        exercises: [
          {
            exerciseId: "bench",
            sets: [{ reps: 8, loadKg: 50, rpe: 8 }]
          }
        ]
      }
    ]);
    const useCase = new ListWorkoutSessionsUseCase(repository);

    const sessions = await useCase.execute("user-1", "plan-1");

    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.planId).toBe("plan-1");
  });
});

