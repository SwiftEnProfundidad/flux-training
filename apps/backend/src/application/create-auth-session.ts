import {
  authSessionSchema,
  type AuthIdentity,
  type AuthSession
} from "@flux/contracts";
import type { AuthTokenVerifier } from "../domain/auth-token-verifier";

export class CreateAuthSessionUseCase {
  constructor(private readonly tokenVerifier: AuthTokenVerifier) {}

  async execute(providerToken: string): Promise<AuthSession> {
    const identity = await this.tokenVerifier.verify(providerToken);
    return authSessionSchema.parse({
      userId: identity.providerUserId,
      token: providerToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      identity
    });
  }

  static makeEmailIdentity(email: string, userId: string): AuthIdentity {
    return {
      provider: "email",
      providerUserId: userId,
      email
    };
  }
}

