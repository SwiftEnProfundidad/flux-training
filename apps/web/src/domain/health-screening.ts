import {
  healthScreeningSchema,
  onboardingProfileInputSchema,
  type HealthScreening,
  type OnboardingProfileInput,
  type ParQResponse
} from "@flux/contracts";

export function evaluateHealthScreening(
  userId: string,
  onboardingProfile: OnboardingProfileInput,
  responses: ParQResponse[]
): HealthScreening {
  onboardingProfileInputSchema.parse(onboardingProfile);
  const risk = responses.some((response) => response.answer) ? "moderate" : "low";
  return healthScreeningSchema.parse({
    userId,
    responses,
    risk,
    reviewedAt: new Date().toISOString()
  });
}

