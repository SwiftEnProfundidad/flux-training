import type { AuthIdentity } from "@flux/contracts";

export interface AuthTokenVerifier {
  verify(providerToken: string): Promise<AuthIdentity>;
}

