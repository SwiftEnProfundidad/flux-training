import { describe, expect, it } from "vitest";
import { RequestAuthRecoveryUseCase } from "./request-auth-recovery";

describe("RequestAuthRecoveryUseCase", () => {
  it("returns recovery_sent_email for email channel", async () => {
    const useCase = new RequestAuthRecoveryUseCase(() => "2026-03-02T12:00:00.000Z");

    const result = await useCase.execute({
      channel: "email",
      identifier: "user@example.com"
    });

    expect(result.status).toBe("recovery_sent_email");
    expect(result.ticketId).toBe("rec-email-2026-03-02T12:00:00.000Z");
  });

  it("returns recovery_sent_sms for sms channel", async () => {
    const useCase = new RequestAuthRecoveryUseCase(() => "2026-03-02T12:00:00.000Z");

    const result = await useCase.execute({
      channel: "sms",
      identifier: "+34123456789"
    });

    expect(result.status).toBe("recovery_sent_sms");
  });

  it("throws when email identifier is malformed", async () => {
    const useCase = new RequestAuthRecoveryUseCase();

    await expect(
      useCase.execute({
        channel: "email",
        identifier: "invalid-email"
      })
    ).rejects.toThrowError("invalid_recovery_identifier");
  });
});
