import {
  healthScreeningSchema,
  type HealthRisk,
  type HealthScreening,
  onboardingProfileInputSchema,
  type OnboardingProfileInput,
  type ParQResponse
} from "@flux/contracts";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";

function evaluateRisk(responses: ParQResponse[]): HealthRisk {
  const hasAnyPositive = responses.some((response) => response.answer);
  return hasAnyPositive ? "moderate" : "low";
}

export class CreateHealthScreeningUseCase {
  constructor(private readonly repository: HealthScreeningRepository) {}

  async execute(input: {
    userId: string;
    onboardingProfile: OnboardingProfileInput;
    responses: ParQResponse[];
  }): Promise<HealthScreening> {
    onboardingProfileInputSchema.parse(input.onboardingProfile);
    const risk = evaluateRisk(input.responses);
    const screening = healthScreeningSchema.parse({
      userId: input.userId,
      responses: input.responses,
      risk,
      reviewedAt: new Date().toISOString()
    });
    await this.repository.save(screening);
    return screening;
  }
}

