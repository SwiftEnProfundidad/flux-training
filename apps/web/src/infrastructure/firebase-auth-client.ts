import type { AuthSession } from "@flux/contracts";
import { initializeApp } from "firebase/app";
import {
  type Auth,
  OAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import type { AuthGateway } from "../domain/auth";
import { assertApiResponse, createApiHeaders } from "./api-client";

let cachedAuth: Auth | null = null;

function isLocalHostname(candidate: string): boolean {
  return candidate === "127.0.0.1" || candidate === "localhost";
}

function hasFirebaseWebConfig(): boolean {
  const apiKey = String(import.meta.env.VITE_FIREBASE_API_KEY ?? "");
  const authDomain = String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "");
  const projectId = String(import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "");
  return apiKey.length > 0 && authDomain.length > 0 && projectId.length > 0;
}

export function isLocalDemoApiTarget(rawTarget: string): boolean {
  const candidate = rawTarget.trim();
  if (candidate.length === 0) {
    return false;
  }
  try {
    const url = new URL(candidate);
    return isLocalHostname(url.hostname);
  } catch {
    return false;
  }
}

export function shouldUseLocalDemoAuthFallbackFromContext(
  rawTarget: string,
  locationHostname: string
): boolean {
  const normalizedTarget = rawTarget.trim();
  if (normalizedTarget.length > 0) {
    return isLocalDemoApiTarget(normalizedTarget);
  }
  return isLocalHostname(locationHostname.trim().toLowerCase());
}

function resolveLocationHostname(): string {
  if (typeof window === "undefined") {
    return "";
  }
  const candidate = window.location?.hostname;
  return typeof candidate === "string" ? candidate : "";
}

function shouldUseLocalDemoAuthFallback(): boolean {
  const rawTarget = String(import.meta.env.VITE_API_TARGET ?? "");
  return shouldUseLocalDemoAuthFallbackFromContext(rawTarget, resolveLocationHostname());
}

function getClientAuth(): Auth {
  if (cachedAuth !== null) {
    return cachedAuth;
  }

  const apiKey = String(import.meta.env.VITE_FIREBASE_API_KEY ?? "");
  const authDomain = String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "");
  const projectId = String(import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "");

  if (apiKey.length === 0 || authDomain.length === 0 || projectId.length === 0) {
    throw new Error("missing_firebase_web_config");
  }

  const firebaseApp = initializeApp({
    apiKey,
    authDomain,
    projectId
  });
  cachedAuth = getAuth(firebaseApp);
  return cachedAuth;
}

async function createBackendSession(providerToken: string): Promise<AuthSession> {
  const response = await fetch("/api/createAuthSession", {
    method: "POST",
    headers: createApiHeaders(undefined, true),
    body: JSON.stringify({ providerToken })
  });

  await assertApiResponse(response, "auth_session_creation_failed");

  const payload = (await response.json()) as { session: AuthSession };
  return payload.session;
}

class FirebaseAuthGateway implements AuthGateway {
  async signInWithApple(): Promise<AuthSession> {
    if (hasFirebaseWebConfig() === false) {
      if (shouldUseLocalDemoAuthFallback()) {
        return createBackendSession("apple-local-dev-token");
      }
      throw new Error("missing_firebase_web_config");
    }

    const auth = getClientAuth();
    const provider = new OAuthProvider("apple.com");
    const credential = await signInWithPopup(auth, provider);
    const providerToken = await credential.user.getIdToken();
    return createBackendSession(providerToken);
  }

  async signInWithEmail(email: string, password: string): Promise<AuthSession> {
    if (hasFirebaseWebConfig() === false) {
      if (shouldUseLocalDemoAuthFallback()) {
        const fallbackToken = email.trim().toLowerCase();
        if (fallbackToken.length === 0) {
          throw new Error("missing_email_for_local_demo_auth");
        }
        return createBackendSession(fallbackToken);
      }
      throw new Error("missing_firebase_web_config");
    }

    const auth = getClientAuth();
    const credential = await signInOrCreateWithEmail(auth, email, password);
    const providerToken = await credential.user.getIdToken();
    return createBackendSession(providerToken);
  }
}

async function signInOrCreateWithEmail(
  auth: Auth,
  email: string,
  password: string
) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (shouldAutoCreateAccount(error) === false) {
      throw error;
    }

    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      throw error;
    }
  }
}

function shouldAutoCreateAccount(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return code === "auth/user-not-found" || code === "auth/invalid-credential";
}

export const firebaseAuthGateway: AuthGateway = new FirebaseAuthGateway();
