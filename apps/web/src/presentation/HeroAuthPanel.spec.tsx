import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HeroAuthPanel } from "./HeroAuthPanel";

const baseProps = {
  isAuthLoading: false,
  email: "",
  password: "",
  emailPlaceholder: "correo",
  passwordPlaceholder: "contrasena",
  signInWithAppleLabel: "Iniciar con Apple",
  signInWithGoogleLabel: "Iniciar con Google",
  signInWithEmailLabel: "Iniciar con email",
  recoverByEmailLabel: "Recuperar por email",
  recoverBySMSLabel: "Recuperar por SMS",
  authStatusLabel: "inicia sesion para continuar",
  actionIds: {
    apple: "web.auth.apple",
    google: "web.auth.google",
    email: "web.auth.email",
    recoverEmail: "web.auth.recover.email",
    recoverSMS: "web.auth.recover.sms",
    status: "web.auth.status"
  },
  onAppleSignIn: vi.fn(),
  onGoogleSignIn: vi.fn(),
  onEmailChange: vi.fn(),
  onPasswordChange: vi.fn(),
  onEmailSignIn: vi.fn(),
  onEmailRecovery: vi.fn()
};

describe("HeroAuthPanel", () => {
  it("renders stacked product mode auth flow", () => {
    const markup = renderToStaticMarkup(
      <HeroAuthPanel
        {...baseProps}
        productMode={true}
        dividerLabel="o"
      />
    );

    expect(markup).toContain("hero-actions-product");
    expect(markup).toContain("hero-auth-divider");
    expect(markup).toContain("<span>o</span>");
    expect(markup).toContain("Iniciar con Google");
    expect(markup).toContain("web.auth.google");
  });

  it("hides status copy when product mode does not need feedback", () => {
    const markup = renderToStaticMarkup(<HeroAuthPanel {...baseProps} showStatus={false} />);

    expect(markup).not.toContain("inicia sesion para continuar");
    expect(markup).not.toContain("web.auth.status");
  });

  it("renders status copy when feedback must stay visible", () => {
    const markup = renderToStaticMarkup(<HeroAuthPanel {...baseProps} showStatus={true} />);

    expect(markup).toContain("inicia sesion para continuar");
    expect(markup).toContain("web.auth.status");
  });
});
