import { authSessionSchema, type AuthSession, type AuthSessionPolicy } from "@flux/contracts";
import { initializeApp } from "firebase/app";
import {
  type Auth,
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import type { AuthGateway } from "../domain/auth";
import { assertApiResponse, createApiHeaders } from "./api-client";

let cachedAuth: Auth | null = null;
const LOCAL_PREVIEW_SESSION_POLICY: AuthSessionPolicy = {
  maxIdleSeconds: 60 * 30,
  rotationIntervalSeconds: 60 * 10,
  absoluteTtlSeconds: 60 * 60 * 12
};

function isLocalHostname(candidate: string): boolean {
  const normalized = candidate.trim().toLowerCase();
  return (
    normalized === "127.0.0.1" ||
    normalized === "localhost" ||
    normalized === "::1" ||
    normalized === "[::1]" ||
    normalized === "::ffff:127.0.0.1"
  );
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
  locationHostname: string,
  isDev = true
): boolean {
  if (isDev === false) {
    return false;
  }
  const normalizedTarget = rawTarget.trim();
  const normalizedHostname = locationHostname.trim().toLowerCase();
  if (isLocalHostname(normalizedHostname)) {
    return true;
  }
  if (normalizedTarget.length > 0) {
    return isLocalDemoApiTarget(normalizedTarget);
  }
  return false;
}

export function shouldPreferLocalPreviewAuthFromContext(
  rawTarget: string,
  locationHostname: string,
  isDev = true,
  forceRealAuth = false
): boolean {
  if (forceRealAuth) {
    return false;
  }
  return shouldUseLocalDemoAuthFallbackFromContext(rawTarget, locationHostname, isDev);
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
  const isDev = import.meta.env.DEV !== false;
  return shouldUseLocalDemoAuthFallbackFromContext(
    rawTarget,
    resolveLocationHostname(),
    isDev
  );
}

function shouldPreferLocalPreviewAuth(): boolean {
  const rawTarget = String(import.meta.env.VITE_API_TARGET ?? "");
  const isDev = import.meta.env.DEV !== false;
  const forceRealAuth = String(import.meta.env.VITE_FORCE_REAL_AUTH ?? "") === "1";
  return shouldPreferLocalPreviewAuthFromContext(
    rawTarget,
    resolveLocationHostname(),
    isDev,
    forceRealAuth
  );
}

function toPreviewSlug(value: string): string {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return sanitized.length > 0 ? sanitized : "athlete";
}

export function createLocalPreviewSession(input: {
  provider: "apple" | "email" | "google";
  email?: string;
}): AuthSession {
  const now = new Date();
  const issuedAtMs = now.getTime();
  const email = resolveLocalPreviewEmail(input);
  const slug = toPreviewSlug(email);
  const providerUserId = `preview-${slug}`;

  return authSessionSchema.parse({
    userId: providerUserId,
    sessionId: `local-preview-session-${input.provider}-${slug}`,
    token: `local-preview-token-${input.provider}-${slug}`,
    issuedAt: now.toISOString(),
    expiresAt: new Date(
      issuedAtMs + LOCAL_PREVIEW_SESSION_POLICY.maxIdleSeconds * 1000
    ).toISOString(),
    rotationRequiredAt: new Date(
      issuedAtMs + LOCAL_PREVIEW_SESSION_POLICY.rotationIntervalSeconds * 1000
    ).toISOString(),
    absoluteExpiresAt: new Date(
      issuedAtMs + LOCAL_PREVIEW_SESSION_POLICY.absoluteTtlSeconds * 1000
    ).toISOString(),
    sessionPolicy: LOCAL_PREVIEW_SESSION_POLICY,
    identity: {
      provider: input.provider,
      providerUserId,
      email,
      displayName: resolveLocalPreviewDisplayName(input.provider)
    }
  });
}

function resolveLocalPreviewEmail(input: {
  provider: "apple" | "email" | "google";
  email?: string;
}): string {
  if (input.provider === "email") {
    return input.email?.trim().toLowerCase() ?? "";
  }
  if (input.provider === "google") {
    return "preview.google@flux.local";
  }
  return "preview@flux.local";
}

function resolveLocalPreviewDisplayName(
  provider: "apple" | "email" | "google"
): string {
  if (provider === "google") {
    return "Preview Google Athlete";
  }
  if (provider === "apple") {
    return "Preview Apple Athlete";
  }
  return "Preview Athlete";
}

function shouldFallbackToLocalPreviewOnError(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return (
    code === "auth/configuration-not-found" ||
    code === "auth/invalid-api-key" ||
    code === "auth/auth-domain-config-required" ||
    code === "auth/operation-not-allowed" ||
    code === "auth/unauthorized-domain"
  );
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

async function signInWithOAuthProvider(
  provider: "apple" | "google"
): Promise<AuthSession> {
  if (shouldPreferLocalPreviewAuth()) {
    return createLocalPreviewSession({ provider });
  }

  if (hasFirebaseWebConfig() === false) {
    if (shouldUseLocalDemoAuthFallback()) {
      return createLocalPreviewSession({ provider });
    }
    throw new Error("missing_firebase_web_config");
  }

  try {
    const auth = getClientAuth();
    const authProvider =
      provider === "apple"
        ? new OAuthProvider("apple.com")
        : new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, authProvider);
    const providerToken = await credential.user.getIdToken();
    return createBackendSession(providerToken);
  } catch (error) {
    if (shouldUseLocalDemoAuthFallback() && shouldFallbackToLocalPreviewOnError(error)) {
      return createLocalPreviewSession({ provider });
    }
    throw error;
  }
}

class FirebaseAuthGateway implements AuthGateway {
  async signInWithApple(): Promise<AuthSession> {
    return signInWithOAuthProvider("apple");
  }

  async signInWithGoogle(): Promise<AuthSession> {
    return signInWithOAuthProvider("google");
  }

  async signInWithEmail(email: string, password: string): Promise<AuthSession> {
    if (shouldPreferLocalPreviewAuth()) {
      const fallbackEmail = email.trim().toLowerCase();
      if (fallbackEmail.length === 0) {
        throw new Error("missing_email_for_local_demo_auth");
      }
      return createLocalPreviewSession({
        provider: "email",
        email: fallbackEmail
      });
    }

    if (hasFirebaseWebConfig() === false) {
      if (shouldUseLocalDemoAuthFallback()) {
        const fallbackEmail = email.trim().toLowerCase();
        if (fallbackEmail.length === 0) {
          throw new Error("missing_email_for_local_demo_auth");
        }
        return createLocalPreviewSession({
          provider: "email",
          email: fallbackEmail
        });
      }
      throw new Error("missing_firebase_web_config");
    }

    try {
      const auth = getClientAuth();
      const credential = await signInOrCreateWithEmail(auth, email, password);
      const providerToken = await credential.user.getIdToken();
      return createBackendSession(providerToken);
    } catch (error) {
      if (shouldUseLocalDemoAuthFallback() && shouldFallbackToLocalPreviewOnError(error)) {
        const fallbackEmail = email.trim().toLowerCase();
        if (fallbackEmail.length === 0) {
          throw new Error("missing_email_for_local_demo_auth");
        }
        return createLocalPreviewSession({
          provider: "email",
          email: fallbackEmail
        });
      }
      throw error;
    }
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
