import {
  healthScreeningSchema,
  onboardingResultSchema,
  onboardingSubmissionInputSchema,
  type OnboardingResult
} from "@flux/contracts";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";
import type { UserProfileRepository } from "../domain/user-profile-repository";

export class CompleteOnboardingUseCase {
  constructor(
    private readonly userProfileRepository: UserProfileRepository,
    private readonly healthScreeningRepository: HealthScreeningRepository
  ) {}

  async execute(payload: unknown): Promise<OnboardingResult> {
    const input = onboardingSubmissionInputSchema.parse(payload);
    const now = new Date().toISOString();
    const profile = {
      id: input.userId,
      displayName: input.onboardingProfile.displayName,
      goal: input.goal,
      age: input.onboardingProfile.age,
      heightCm: input.onboardingProfile.heightCm,
      weightKg: input.onboardingProfile.weightKg,
      createdAt: now
    };
    const risk = input.responses.some((response) => response.answer) ? "moderate" : "low";
    const screening = healthScreeningSchema.parse({
      userId: input.userId,
      responses: input.responses,
      risk,
      reviewedAt: now
    });
    await this.userProfileRepository.save(profile);
    await this.healthScreeningRepository.save(screening);
    return onboardingResultSchema.parse({
      profile,
      screening
    });
  }
}

