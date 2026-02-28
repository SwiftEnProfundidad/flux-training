import {
  exerciseVideoSchema,
  trainingPlanSchema,
  type ExerciseVideo,
  workoutSessionInputSchema,
  type TrainingPlan,
  type WorkoutSessionInput
} from "@flux/contracts";

export interface TrainingGateway {
  createTrainingPlan(input: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan>;
  listTrainingPlans(userId: string): Promise<TrainingPlan[]>;
  createWorkoutSession(input: WorkoutSessionInput): Promise<WorkoutSessionInput>;
  listWorkoutSessions(userId: string, planId?: string): Promise<WorkoutSessionInput[]>;
  listExerciseVideos(exerciseId: string, locale: string): Promise<ExerciseVideo[]>;
}

export class ManageTrainingUseCase {
  constructor(private readonly gateway: TrainingGateway) {}

  async createTrainingPlan(input: Omit<TrainingPlan, "createdAt">): Promise<TrainingPlan> {
    const plan = await this.gateway.createTrainingPlan(input);
    return trainingPlanSchema.parse(plan);
  }

  async listTrainingPlans(userId: string): Promise<TrainingPlan[]> {
    const plans = await this.gateway.listTrainingPlans(userId);
    return trainingPlanSchema.array().parse(plans);
  }

  async createWorkoutSession(input: WorkoutSessionInput): Promise<WorkoutSessionInput> {
    const session = await this.gateway.createWorkoutSession(input);
    return workoutSessionInputSchema.parse(session);
  }

  async listWorkoutSessions(userId: string, planId?: string): Promise<WorkoutSessionInput[]> {
    const sessions = await this.gateway.listWorkoutSessions(userId, planId);
    return workoutSessionInputSchema.array().parse(sessions);
  }

  async listExerciseVideos(exerciseId: string, locale: string): Promise<ExerciseVideo[]> {
    const videos = await this.gateway.listExerciseVideos(exerciseId, locale);
    return exerciseVideoSchema.array().parse(videos);
  }
}
