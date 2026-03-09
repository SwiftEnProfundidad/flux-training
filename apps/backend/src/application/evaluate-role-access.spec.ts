import { describe, expect, it } from "vitest";
import { EvaluateRoleAccessUseCase } from "./evaluate-role-access";

describe("EvaluateRoleAccessUseCase", () => {
  it("allows admin action on onboarding without conditional constraints", () => {
    const useCase = new EvaluateRoleAccessUseCase();

    const result = useCase.execute({
      role: "admin",
      domain: "onboarding",
      action: "approve",
      context: {
        isOwner: false,
        medicalDisclaimerAccepted: false
      }
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("allowed");
  });

  it("denies coach access to onboarding domain", () => {
    const useCase = new EvaluateRoleAccessUseCase();

    const result = useCase.execute({
      role: "coach",
      domain: "onboarding",
      action: "view",
      context: {
        isOwner: false,
        medicalDisclaimerAccepted: true
      }
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("domain_denied");
  });

  it("denies athlete training action when medical consent is missing", () => {
    const useCase = new EvaluateRoleAccessUseCase();

    const result = useCase.execute({
      role: "athlete",
      domain: "training",
      action: "view",
      context: {
        isOwner: true,
        medicalDisclaimerAccepted: false
      }
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("medical_consent_required");
  });

  it("denies ownership-constrained actions when actor is not owner", () => {
    const useCase = new EvaluateRoleAccessUseCase();

    const result = useCase.execute({
      role: "athlete",
      domain: "nutrition",
      action: "update",
      context: {
        isOwner: false,
        medicalDisclaimerAccepted: true
      }
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("ownership_required");
  });
});
