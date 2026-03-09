import { describe, expect, it } from "vitest";
import { CreateAuthSessionUseCase } from "./create-auth-session";
import type { AuthTokenVerifier } from "../domain/auth-token-verifier";

class InMemoryAuthTokenVerifier implements AuthTokenVerifier {
  lastToken: string | null = null;

  async verify(providerToken: string): Promise<{
    provider: "apple";
    providerUserId: string;
    email: string;
    displayName: string;
  }> {
    this.lastToken = providerToken;
    return {
      provider: "apple",
      providerUserId: "user-1",
      email: "user@example.com",
      displayName: "User"
    };
  }
}

describe("CreateAuthSessionUseCase", () => {
  it("returns an app session with hardened policy and deterministic timestamps", async () => {
    const verifier = new InMemoryAuthTokenVerifier();
    const now = () => new Date("2026-03-02T10:00:00.000Z");
    const useCase = new CreateAuthSessionUseCase(
      verifier,
      now,
      () => "session-fixed"
    );

    const session = await useCase.execute("provider-token ");

    expect(session.userId).toBe("user-1");
    expect(session.identity.provider).toBe("apple");
    expect(session.token).toBe("provider-token");
    expect(session.sessionId).toBe("session-fixed");
    expect(session.issuedAt).toBe("2026-03-02T10:00:00.000Z");
    expect(session.rotationRequiredAt).toBe("2026-03-02T10:10:00.000Z");
    expect(session.expiresAt).toBe("2026-03-02T10:30:00.000Z");
    expect(session.absoluteExpiresAt).toBe("2026-03-02T22:00:00.000Z");
    expect(session.sessionPolicy).toEqual({
      maxIdleSeconds: 1800,
      rotationIntervalSeconds: 600,
      absoluteTtlSeconds: 43200
    });
    expect(verifier.lastToken).toBe("provider-token");
    expect(new Date(session.rotationRequiredAt).getTime()).toBeGreaterThan(
      new Date(session.issuedAt).getTime()
    );
    expect(new Date(session.absoluteExpiresAt).getTime()).toBeGreaterThan(
      new Date(session.expiresAt).getTime()
    );
  });

  it("rejects empty or oversized tokens before verifier execution", async () => {
    const verifier = new InMemoryAuthTokenVerifier();
    const useCase = new CreateAuthSessionUseCase(
      verifier,
      () => new Date("2026-03-02T10:00:00.000Z"),
      () => "session-fixed"
    );

    await expect(useCase.execute("   ")).rejects.toThrow("invalid_provider_token");
    await expect(useCase.execute("x".repeat(4097))).rejects.toThrow(
      "invalid_provider_token"
    );
  });
});
