import type { ExerciseVideo, TrainingPlan, WorkoutSessionInput } from "@flux/contracts";
import type { TrainingGateway } from "../application/manage-training";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiTrainingGateway implements TrainingGateway {
  async createTrainingPlan(input: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan> {
    const response = await fetch("/api/createTrainingPlan", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(input)
    });

    await assertApiResponse(response, "create_training_plan_failed");

    const payload = (await response.json()) as { plan: TrainingPlan };
    return payload.plan;
  }

  async listTrainingPlans(userId: string): Promise<TrainingPlan[]> {
    const response = await fetch(`/api/listTrainingPlans?userId=${encodeURIComponent(userId)}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_training_plans_failed");
    const payload = (await response.json()) as { plans: TrainingPlan[] };
    return payload.plans;
  }

  async createWorkoutSession(input: WorkoutSessionInput): Promise<WorkoutSessionInput> {
    const response = await fetch("/api/createWorkoutSession", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(input)
    });
    await assertApiResponse(response, "create_workout_session_failed");
    const payload = (await response.json()) as { payload: WorkoutSessionInput };
    return payload.payload;
  }

  async listWorkoutSessions(userId: string, planId?: string): Promise<WorkoutSessionInput[]> {
    const query = new URLSearchParams({ userId });
    if (planId !== undefined && planId.length > 0) {
      query.set("planId", planId);
    }
    const response = await fetch(`/api/listWorkoutSessions?${query.toString()}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_workout_sessions_failed");
    const payload = (await response.json()) as { sessions: WorkoutSessionInput[] };
    return payload.sessions;
  }

  async listExerciseVideos(exerciseId: string, locale: string): Promise<ExerciseVideo[]> {
    const query = new URLSearchParams({
      userId: "demo-user",
      exerciseId,
      locale
    });
    const response = await fetch(`/api/listExerciseVideos?${query.toString()}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_exercise_videos_failed");
    const payload = (await response.json()) as { videos: ExerciseVideo[] };
    return payload.videos;
  }
}

export const apiTrainingGateway: TrainingGateway = new ApiTrainingGateway();
