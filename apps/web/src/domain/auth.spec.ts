import { describe, expect, it } from "vitest";
import type { AuthGateway } from "./auth";
import { CreateAuthSessionUseCase } from "./auth";

class InMemoryAuthGateway implements AuthGateway {
  async signInWithApple() {
    return {
      userId: "apple-user",
      token: "apple-token",
      expiresAt: "2026-02-25T13:00:00.000Z",
      identity: {
        provider: "apple" as const,
        providerUserId: "apple-user"
      }
    };
  }

  async signInWithEmail(email: string) {
    return {
      userId: email,
      token: "email-token",
      expiresAt: "2026-02-25T13:00:00.000Z",
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
});

