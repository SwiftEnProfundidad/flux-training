import { describe, expect, it } from "vitest";
import {
  isLocalDemoApiTarget,
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
      shouldUseLocalDemoAuthFallbackFromContext("http://127.0.0.1:8787", "app.flux-training.com")
    ).toBe(true);
  });

  it("uses local fallback in localhost runtime when api target is not defined", () => {
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "localhost")).toBe(true);
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "127.0.0.1")).toBe(true);
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "::1")).toBe(true);
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "[::1]")).toBe(true);
  });

  it("does not use local fallback in non-local runtime when api target is not defined", () => {
    expect(shouldUseLocalDemoAuthFallbackFromContext("", "app.flux-training.com")).toBe(false);
  });
});
