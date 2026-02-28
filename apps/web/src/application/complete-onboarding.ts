import {
  onboardingSubmissionInputSchema,
  onboardingResultSchema,
  type OnboardingResult,
  type OnboardingSubmissionInput
} from "@flux/contracts";

export interface OnboardingGateway {
  completeOnboarding(input: OnboardingSubmissionInput): Promise<OnboardingResult>;
}

export class CompleteOnboardingUseCase {
  constructor(private readonly gateway: OnboardingGateway) {}

  async execute(input: OnboardingSubmissionInput): Promise<OnboardingResult> {
    const validatedInput = onboardingSubmissionInputSchema.parse(input);
    const result = await this.gateway.completeOnboarding(validatedInput);
    return onboardingResultSchema.parse(result);
  }
}

