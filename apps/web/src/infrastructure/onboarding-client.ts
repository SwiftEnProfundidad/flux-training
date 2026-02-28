import type { OnboardingResult, OnboardingSubmissionInput } from "@flux/contracts";
import type { OnboardingGateway } from "../application/complete-onboarding";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiOnboardingGateway implements OnboardingGateway {
  async completeOnboarding(input: OnboardingSubmissionInput): Promise<OnboardingResult> {
    const response = await fetch("/api/completeOnboarding", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(input)
    });

    await assertApiResponse(response, "complete_onboarding_failed");

    const payload = (await response.json()) as { result: OnboardingResult };
    return payload.result;
  }
}

export const apiOnboardingGateway: OnboardingGateway = new ApiOnboardingGateway();
