import { describe, expect, it } from "vitest";
import {
  createLocalPreviewSession,
  isLocalDemoApiTarget,
  shouldPreferLocalPreviewAuthFromContext,
  shouldUseLocalDemoAuthFallbackFromContext
} from "./firebase-auth-client";

describe("isLocalDemoApiTarget", () => {
  it("returns true for localhost demo API target", () => {
    expect(isLocalDemoApiTarget("http://127.0.0.1:8787")).toBe(true);
    expect(isLocalDemoApiTarget("http://localhost:8787")).toBe(true);
    expect(isLocalDemoApiTarget("http://[::1]:8787")).toBe(true);
  });

  it("returns false for cloud API target", () => {
    expect(
      isLocalDemoApiTarget("https://us-central1-flux-training.cloudfunctions.net/flux-training")
    ).toBe(false);
  });

  it("returns false for invalid targets", () => {
    expect(isLocalDemoApiTarget("")).toBe(false);
    expect(isLocalDemoApiTarget("not-a-url")).toBe(false);
  });
});

describe("shouldUseLocalDemoAuthFallbackFromContext", () => {
  it("uses local fallback when api target is local", () => {
    expect(
      shouldUseLocalDemoAuthFallbackFromContext(
        "http://127.0.0.1:8787",
        "app.flux-training.com",
        true
      )
    ).toBe(true);
  });

  it("uses local fallback in localhost runtime when api target is not defined", () => {
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "localhost", true)).toBe(true);
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "127.0.0.1", true)).toBe(true);
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "::1", true)).toBe(true);
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "[::1]", true)).toBe(true);
  });

  it("does not use local fallback in non-local runtime when api target is not defined", () => {
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "app.flux-training.com", true)).toBe(false);
  });

  it("does not use local fallback outside dev mode", () => {
    expect(
      shouldUseLocalDemoAuthFallbackFromContext("http://127.0.0.1:8787", "localhost", false)
    ).toBe(false);
  });
});

describe("shouldPreferLocalPreviewAuthFromContext", () => {
  it("prefers local preview auth in localhost dev runtime", () => {
    expect(
      shouldPreferLocalPreviewAuthFromContext(
        "https://skill-deploy-e9ta5haso1-codex-agent-deploys.vercel.app/api",
        "localhost",
        true,
        false
      )
    ).toBe(true);
  });

  it("allows forcing real auth in localhost dev runtime", () => {
    expect(
      shouldPreferLocalPreviewAuthFromContext(
        "https://skill-deploy-e9ta5haso1-codex-agent-deploys.vercel.app/api",
        "localhost",
        true,
        true
      )
    ).toBe(false);
  });
});

describe("createLocalPreviewSession", () => {
  it("creates a valid local preview email session", () => {
    const session = createLocalPreviewSession({
      provider: "email",
      email: "Preview.User@Flux.app"
    });

    expect(session.userId).toBe("preview-preview-user-flux-app");
    expect(session.identity.provider).toBe("email");
    expect(session.identity.email).toBe("preview.user@flux.app");
    expect(session.token).toContain("local-preview-token-email-preview-user-flux-app");
    expect(session.sessionPolicy.maxIdleSeconds).toBe(1800);
  });

  it("creates a valid local preview apple session", () => {
    const session = createLocalPreviewSession({
      provider: "apple"
    });

    expect(session.identity.provider).toBe("apple");
    expect(session.identity.email).toBe("preview@flux.local");
    expect(session.userId).toBe("preview-preview-flux-local");
  });

  it("creates a valid local preview google session", () => {
    const session = createLocalPreviewSession({
      provider: "google"
    });

    expect(session.identity.provider).toBe("google");
    expect(session.identity.email).toBe("preview.google@flux.local");
    expect(session.identity.displayName).toBe("Preview Google Athlete");
    expect(session.userId).toBe("preview-preview-google-flux-local");
  });
});
