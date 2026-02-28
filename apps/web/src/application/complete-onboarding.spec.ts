import { describe, expect, it } from "vitest";
import type { OnboardingGateway } from "./complete-onboarding";
import { CompleteOnboardingUseCase } from "./complete-onboarding";

class InMemoryOnboardingGateway implements OnboardingGateway {
  async completeOnboarding() {
    return {
      profile: {
        id: "user-1",
        displayName: "Juan",
        goal: "recomposition" as const,
        age: 35,
        heightCm: 178,
        weightKg: 84,
        createdAt: "2026-02-25T13:00:00.000Z"
      },
      screening: {
        userId: "user-1",
        responses: [{ questionId: "parq-1", answer: true }],
        risk: "moderate" as const,
        reviewedAt: "2026-02-25T13:00:00.000Z"
      }
    };
  }
}

describe("CompleteOnboardingUseCase", () => {
  it("returns validated onboarding result", async () => {
    const useCase = new CompleteOnboardingUseCase(new InMemoryOnboardingGateway());

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
      responses: [{ questionId: "parq-1", answer: true }]
    });

    expect(result.profile.id).toBe("user-1");
    expect(result.screening.risk).toBe("moderate");
  });
});

