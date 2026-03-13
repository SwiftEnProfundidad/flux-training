import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AccessGateCard } from "./AccessGateCard";

describe("AccessGateCard", () => {
  it("renders apple, google and email entry actions", () => {
    const markup = renderToStaticMarkup(
      <AccessGateCard
        screenId="web.accessGate.screen"
        routeId="web.route.accessGate"
        title="Acceso"
        summary="Resumen"
        hint="Hint"
        signInWithAppleLabel="Iniciar con Apple"
        signInWithGoogleLabel="Iniciar con Google"
        signInWithEmailLabel="Iniciar con email"
        appleActionId="web.accessGate.apple"
        googleActionId="web.accessGate.google"
        emailActionId="web.accessGate.email"
        onAppleSignIn={vi.fn()}
        onGoogleSignIn={vi.fn()}
        onEmailSignIn={vi.fn()}
      />
    );

    expect(markup).toContain("Iniciar con Apple");
    expect(markup).toContain("Iniciar con Google");
    expect(markup).toContain("Iniciar con email");
    expect(markup).toContain("web.accessGate.google");
  });
});
