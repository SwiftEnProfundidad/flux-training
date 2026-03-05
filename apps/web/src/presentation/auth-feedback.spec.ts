import { describe, expect, it } from "vitest";
import { resolveAuthHeroStatus } from "./auth-feedback";

describe("resolveAuthHeroStatus", () => {
  it("returns active-session copy when authenticated", () => {
    expect(
      resolveAuthHeroStatus({
        authStatus: "signed_in:email",
        hasAuthenticatedSession: true,
        language: "es"
      })
    ).toBe("sesion activa");
  });

  it("returns ready copy when session is required", () => {
    expect(
      resolveAuthHeroStatus({
        authStatus: "session_required",
        hasAuthenticatedSession: false,
        language: "en"
      })
    ).toBe("ready to sign in");
  });

  it("returns loading copy while sign-in is running", () => {
    expect(
      resolveAuthHeroStatus({
        authStatus: "loading",
        hasAuthenticatedSession: false,
        language: "es"
      })
    ).toBe("iniciando sesion...");
  });

  it("returns user-friendly copy for auth errors", () => {
    expect(
      resolveAuthHeroStatus({
        authStatus: "auth_error",
        hasAuthenticatedSession: false,
        language: "es"
      })
    ).toBe("no pudimos iniciar sesion. revisa credenciales o configuracion.");
  });
});
