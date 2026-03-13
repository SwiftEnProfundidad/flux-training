import { describe, expect, it } from "vitest";
import { resolveAuthProvider } from "./firebase-auth-token-verifier";

describe("resolveAuthProvider", () => {
  it("maps apple sign in provider", () => {
    expect(resolveAuthProvider("apple.com")).toBe("apple");
  });

  it("maps google sign in provider", () => {
    expect(resolveAuthProvider("google.com")).toBe("google");
  });

  it("falls back to email for password auth providers", () => {
    expect(resolveAuthProvider("password")).toBe("email");
    expect(resolveAuthProvider(undefined)).toBe("email");
  });
});
