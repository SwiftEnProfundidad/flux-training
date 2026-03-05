import { describe, expect, it } from "vitest";
import { isLocalDemoApiTarget } from "./firebase-auth-client";

describe("isLocalDemoApiTarget", () => {
  it("returns true for localhost demo API target", () => {
    expect(isLocalDemoApiTarget("http://127.0.0.1:8787")).toBe(true);
    expect(isLocalDemoApiTarget("http://localhost:8787")).toBe(true);
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
