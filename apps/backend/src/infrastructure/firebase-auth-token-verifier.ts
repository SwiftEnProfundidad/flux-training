import type { AuthIdentity } from "@flux/contracts";
import { getAuth } from "firebase-admin/auth";
import { getApps, initializeApp } from "firebase-admin/app";
import type { AuthTokenVerifier } from "../domain/auth-token-verifier";

const app = getApps()[0] ?? initializeApp();

export class FirebaseAuthTokenVerifier implements AuthTokenVerifier {
  async verify(providerToken: string): Promise<AuthIdentity> {
    const decodedToken = await getAuth(app).verifyIdToken(providerToken);
    const provider =
      decodedToken.firebase?.sign_in_provider === "apple.com" ? "apple" : "email";
    return {
      provider,
      providerUserId: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name
    };
  }
}

