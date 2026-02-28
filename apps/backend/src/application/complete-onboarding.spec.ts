import { describe, expect, it } from "vitest";
import type { HealthScreening, UserProfile } from "@flux/contracts";
import { CompleteOnboardingUseCase } from "./complete-onboarding";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";
import type { UserProfileRepository } from "../domain/user-profile-repository";

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

describe("CompleteOnboardingUseCase", () => {
  it("persists profile and health screening", async () => {
    const userRepository = new InMemoryUserProfileRepository();
    const healthRepository = new InMemoryHealthScreeningRepository();
    const useCase = new CompleteOnboardingUseCase(userRepository, healthRepository);

    const result = await useCase.execute({
      userId: "user-1",
      goal: "recomposition",
      onboardingProfile: {
        displayName: "Juan",
        age: 35,
        heightCm: 178,
        weightKg: 84,
        availableDaysPerWeek: 4,
        equipment: ["dumbbells"],
        injuries: []
      },
      responses: [
        { questionId: "parq-1", answer: false },
        { questionId: "parq-2", answer: true }
      ]
    });

    expect(result.profile.id).toBe("user-1");
    expect(result.screening.risk).toBe("moderate");
    expect(userRepository.records).toHaveLength(1);
    expect(healthRepository.records).toHaveLength(1);
  });
});

