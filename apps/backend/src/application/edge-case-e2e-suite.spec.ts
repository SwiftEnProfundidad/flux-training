import { describe, expect, it } from "vitest";
import type {
  HealthScreening,
  NutritionLog,
  TrainingPlan,
  UserProfile,
  WorkoutSessionInput
} from "@flux/contracts";
import { CompleteOnboardingUseCase } from "./complete-onboarding";
import { GetProgressSummaryUseCase } from "./get-progress-summary";
import { ProcessSyncQueueUseCase } from "./process-sync-queue";
import { RecordLegalConsentUseCase } from "./record-legal-consent";
import { RequestAuthRecoveryUseCase } from "./request-auth-recovery";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";
import type { LegalConsentRepository } from "../domain/legal-consent-repository";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import type { UserProfileRepository } from "../domain/user-profile-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

class InMemoryUserProfileRepository implements UserProfileRepository {
  records: UserProfile[] = [];

  async save(profile: UserProfile): Promise<void> {
    this.records.push(profile);
  }
}

class InMemoryHealthScreeningRepository implements HealthScreeningRepository {
  records: HealthScreening[] = [];

  async save(screening: HealthScreening): Promise<void> {
    this.records.push(screening);
  }
}

class InMemoryTrainingPlanRepository implements TrainingPlanRepository {
  records: TrainingPlan[] = [];

  async save(plan: TrainingPlan): Promise<void> {
    this.records.push(plan);
  }

  async listByUserId(userId: string): Promise<TrainingPlan[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryWorkoutSessionRepository implements WorkoutSessionRepository {
  records: WorkoutSessionInput[] = [];

  async save(session: WorkoutSessionInput): Promise<void> {
    this.records.push(session);
  }

  async listByUserId(userId: string): Promise<WorkoutSessionInput[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryNutritionLogRepository implements NutritionLogRepository {
  records: NutritionLog[] = [];

  async save(log: NutritionLog): Promise<void> {
    this.records.push(log);
  }

  async listByUserId(userId: string): Promise<NutritionLog[]> {
    return this.records.filter((record) => record.userId === userId);
  }
}

class InMemoryLegalConsentRepository implements LegalConsentRepository {
  async save(): Promise<void> {}
}

describe("EdgeCaseE2ESuite", () => {
  it("handles validation failures and rejected sync queue items deterministically", async () => {
    const userProfileRepository = new InMemoryUserProfileRepository();
    const healthScreeningRepository = new InMemoryHealthScreeningRepository();
    const trainingPlanRepository = new InMemoryTrainingPlanRepository();
    const workoutSessionRepository = new InMemoryWorkoutSessionRepository();
    const nutritionLogRepository = new InMemoryNutritionLogRepository();
    const legalConsentRepository = new InMemoryLegalConsentRepository();

    const completeOnboardingUseCase = new CompleteOnboardingUseCase(
      userProfileRepository,
      healthScreeningRepository
    );
    const requestAuthRecoveryUseCase = new RequestAuthRecoveryUseCase(
      () => "2026-03-02T19:00:00.000Z"
    );
    const recordLegalConsentUseCase = new RecordLegalConsentUseCase(
      legalConsentRepository
    );
    const processSyncQueueUseCase = new ProcessSyncQueueUseCase(
      trainingPlanRepository,
      workoutSessionRepository,
      nutritionLogRepository
    );
    const getProgressSummaryUseCase = new GetProgressSummaryUseCase(
      workoutSessionRepository,
      nutritionLogRepository
    );

    await expect(
      requestAuthRecoveryUseCase.execute({
        channel: "email",
        identifier: "invalid-email"
      })
    ).rejects.toThrowError("invalid_recovery_identifier");

    await expect(
      completeOnboardingUseCase.execute({
        userId: "user-edge-1",
        goal: "fat_loss",
        onboardingProfile: {
          displayName: "Edge",
          age: 16,
          heightCm: 170,
          weightKg: 70,
          availableDaysPerWeek: 4,
          equipment: [],
          injuries: []
        },
        responses: [{ questionId: "parq-1", answer: false }]
      })
    ).rejects.toThrow();

    await expect(
      recordLegalConsentUseCase.execute({
        userId: "user-edge-1",
        acceptedAt: "2026-03-02T19:01:00.000Z",
        privacyPolicyAccepted: true,
        termsAccepted: false,
        medicalDisclaimerAccepted: true
      })
    ).rejects.toThrowError("legal_consent_incomplete");

    const syncResult = await processSyncQueueUseCase.execute("user-edge-1", [
      {
        id: "queue-invalid-user",
        userId: "other-user",
        enqueuedAt: "2026-03-02T19:02:00.000Z",
        action: {
          type: "create_training_plan",
          payload: {
            id: "plan-edge-1",
            userId: "other-user",
            name: "Edge Plan",
            weeks: 4,
            days: []
          }
        }
      },
      {
        id: "queue-invalid-payload-user",
        userId: "user-edge-1",
        enqueuedAt: "2026-03-02T19:03:00.000Z",
        action: {
          type: "create_nutrition_log",
          payload: {
            userId: "other-user",
            date: "2026-03-02",
            calories: 2200,
            proteinGrams: 150,
            carbsGrams: 230,
            fatsGrams: 70
          }
        }
      }
    ]);

    await expect(getProgressSummaryUseCase.execute("")).rejects.toThrowError(
      "missing_user_id"
    );

    expect(syncResult.acceptedIds).toEqual([]);
    expect(syncResult.rejected).toEqual([
      { id: "queue-invalid-user", reason: "invalid_user" },
      { id: "queue-invalid-payload-user", reason: "invalid_payload_user" }
    ]);
  });
});
