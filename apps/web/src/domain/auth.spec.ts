import { describe, expect, it } from "vitest";
import type { AuthGateway } from "./auth";
import { CreateAuthSessionUseCase } from "./auth";

class InMemoryAuthGateway implements AuthGateway {
  async signInWithApple() {
    return {
      userId: "apple-user",
      sessionId: "web-session-apple",
      token: "apple-token",
      issuedAt: "2026-02-25T12:30:00.000Z",
      expiresAt: "2026-02-25T13:00:00.000Z",
      rotationRequiredAt: "2026-02-25T12:40:00.000Z",
      absoluteExpiresAt: "2026-02-26T00:30:00.000Z",
      sessionPolicy: {
        maxIdleSeconds: 1800,
        rotationIntervalSeconds: 600,
        absoluteTtlSeconds: 43200
      },
      identity: {
        provider: "apple" as const,
        providerUserId: "apple-user"
      }
    };
  }

  async signInWithGoogle() {
    return {
      userId: "google-user",
      sessionId: "web-session-google",
      token: "google-token",
      issuedAt: "2026-02-25T12:30:00.000Z",
      expiresAt: "2026-02-25T13:00:00.000Z",
      rotationRequiredAt: "2026-02-25T12:40:00.000Z",
      absoluteExpiresAt: "2026-02-26T00:30:00.000Z",
      sessionPolicy: {
        maxIdleSeconds: 1800,
        rotationIntervalSeconds: 600,
        absoluteTtlSeconds: 43200
      },
      identity: {
        provider: "google" as const,
        providerUserId: "google-user",
        email: "google.user@example.com",
        displayName: "Google User"
      }
    };
  }

  async signInWithEmail(email: string) {
    return {
      userId: email,
      sessionId: "web-session-email",
      token: "email-token",
      issuedAt: "2026-02-25T12:30:00.000Z",
      expiresAt: "2026-02-25T13:00:00.000Z",
      rotationRequiredAt: "2026-02-25T12:40:00.000Z",
      absoluteExpiresAt: "2026-02-26T00:30:00.000Z",
      sessionPolicy: {
        maxIdleSeconds: 1800,
        rotationIntervalSeconds: 600,
        absoluteTtlSeconds: 43200
      },
      identity: {
        provider: "email" as const,
        providerUserId: email,
        email
      }
    };
  }
}

describe("CreateAuthSessionUseCase", () => {
  it("creates apple session", async () => {
    const useCase = new CreateAuthSessionUseCase(new InMemoryAuthGateway());

    const session = await useCase.executeWithApple();

    expect(session.identity.provider).toBe("apple");
  });

  it("creates email session", async () => {
    const useCase = new CreateAuthSessionUseCase(new InMemoryAuthGateway());

    const session = await useCase.executeWithEmail("user@example.com", "123456");

    expect(session.identity.provider).toBe("email");
    expect(session.userId).toBe("user@example.com");
  });

  it("creates google session", async () => {
    const useCase = new CreateAuthSessionUseCase(new InMemoryAuthGateway());

    const session = await useCase.executeWithGoogle();

    expect(session.identity.provider).toBe("google");
    expect(session.identity.email).toBe("google.user@example.com");
  });
});
