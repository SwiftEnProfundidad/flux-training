import { describe, expect, it } from "vitest";
import { CreateAuthSessionUseCase } from "./create-auth-session";
import type { AuthTokenVerifier } from "../domain/auth-token-verifier";

class InMemoryAuthTokenVerifier implements AuthTokenVerifier {
  async verify(): Promise<{
    provider: "apple";
    providerUserId: string;
    email: string;
    displayName: string;
  }> {
    return {
      provider: "apple",
      providerUserId: "user-1",
      email: "user@example.com",
      displayName: "User"
    };
  }
}

describe("CreateAuthSessionUseCase", () => {
  it("returns an app session for a valid token", async () => {
    const useCase = new CreateAuthSessionUseCase(new InMemoryAuthTokenVerifier());

    const session = await useCase.execute("provider-token");

    expect(session.userId).toBe("user-1");
    expect(session.identity.provider).toBe("apple");
    expect(session.token).toBe("provider-token");
  });
});

