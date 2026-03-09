import {
  authSessionSchema,
  type AuthIdentity,
  type AuthSessionPolicy,
  type AuthSession
} from "@flux/contracts";
import { randomUUID } from "node:crypto";
import type { AuthTokenVerifier } from "../domain/auth-token-verifier";

const AUTH_SESSION_POLICY: AuthSessionPolicy = {
  maxIdleSeconds: 60 * 30,
  rotationIntervalSeconds: 60 * 10,
  absoluteTtlSeconds: 60 * 60 * 12
};

export class CreateAuthSessionUseCase {
  constructor(
    private readonly tokenVerifier: AuthTokenVerifier,
    private readonly now: () => Date = () => new Date(),
    private readonly generateSessionId: () => string = () => randomUUID()
  ) {}

  async execute(providerToken: string): Promise<AuthSession> {
    const normalizedToken = providerToken.trim();
    if (normalizedToken.length === 0 || normalizedToken.length > 4096) {
      throw new Error("invalid_provider_token");
    }

    const identity = await this.tokenVerifier.verify(normalizedToken);
    const issuedAt = this.now();
    const issuedAtMs = issuedAt.getTime();
    const expiresAt = new Date(
      issuedAtMs + AUTH_SESSION_POLICY.maxIdleSeconds * 1000
    );
    const rotationRequiredAt = new Date(
      issuedAtMs + AUTH_SESSION_POLICY.rotationIntervalSeconds * 1000
    );
    const absoluteExpiresAt = new Date(
      issuedAtMs + AUTH_SESSION_POLICY.absoluteTtlSeconds * 1000
    );

    return authSessionSchema.parse({
      userId: identity.providerUserId,
      sessionId: this.generateSessionId(),
      token: normalizedToken,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      rotationRequiredAt: rotationRequiredAt.toISOString(),
      absoluteExpiresAt: absoluteExpiresAt.toISOString(),
      sessionPolicy: AUTH_SESSION_POLICY,
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
