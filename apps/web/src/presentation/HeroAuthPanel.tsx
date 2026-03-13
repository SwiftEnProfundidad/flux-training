import { memo, type FormEvent } from "react";

type ProductAuthStep = "access_gate" | "sign_in";

interface HeroAuthPanelProps {
  isAuthLoading: boolean;
  email: string;
  password: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  signInWithAppleLabel: string;
  signInWithGoogleLabel: string;
  signInWithEmailLabel: string;
  recoverByEmailLabel: string;
  recoverBySMSLabel: string;
  authStatusLabel: string;
  showStatus?: boolean;
  productMode?: boolean;
  productStep?: ProductAuthStep;
  dividerLabel?: string;
  continueWithEmailLabel?: string;
  continueWithGoogleLabel?: string;
  accessHintLabel?: string;
  actionIds: {
    apple: string;
    google: string;
    email: string;
    recoverEmail: string;
    recoverSMS: string;
    status: string;
  };
  onAppleSignIn: () => void;
  onGoogleSignIn: () => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEmailSignIn: () => void;
  onEmailRecovery: (channel: "email" | "sms") => void;
}

export const HeroAuthPanel = memo(function HeroAuthPanel({
  isAuthLoading,
  email,
  password,
  emailPlaceholder,
  passwordPlaceholder,
  signInWithAppleLabel,
  signInWithGoogleLabel,
  signInWithEmailLabel,
  recoverByEmailLabel,
  recoverBySMSLabel,
  authStatusLabel,
  showStatus = true,
  productMode = false,
  productStep = "access_gate",
  dividerLabel = "or",
  continueWithEmailLabel,
  continueWithGoogleLabel,
  accessHintLabel,
  actionIds,
  onAppleSignIn,
  onGoogleSignIn,
  onEmailChange,
  onPasswordChange,
  onEmailSignIn,
  onEmailRecovery
}: HeroAuthPanelProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onEmailSignIn();
  }

  if (productMode) {
    if (productStep === "access_gate") {
      return (
        <div className="hero-actions hero-actions-product">
          <form className="hero-auth-fields hero-auth-fields-product" onSubmit={handleSubmit}>
            <input
              aria-label={emailPlaceholder}
              placeholder={emailPlaceholder}
              value={email}
              type="email"
              autoComplete="email"
              onChange={(event) => onEmailChange(event.target.value)}
            />
            <button
              className="button primary hero-primary-action"
              type="submit"
              disabled={isAuthLoading}
              data-action-id={actionIds.email}
            >
              {continueWithEmailLabel ?? signInWithEmailLabel}
            </button>
          </form>
          <div className="hero-auth-divider" aria-hidden="true">
            <span>{dividerLabel}</span>
          </div>
          <button
            className="button ghost hero-provider-action hero-provider-action-rich"
            onClick={onGoogleSignIn}
            type="button"
            disabled={isAuthLoading}
            data-action-id={actionIds.google}
          >
            <span className="hero-provider-emblem" aria-hidden="true">
              G
            </span>
            <span className="hero-provider-copy">
              {continueWithGoogleLabel ?? signInWithGoogleLabel}
            </span>
          </button>
          {accessHintLabel ? <p className="hero-access-note">{accessHintLabel}</p> : null}
          {showStatus ? (
            <p className="hero-status" data-status-id={actionIds.status}>
              {authStatusLabel}
            </p>
          ) : null}
        </div>
      );
    }

    return (
      <div className="hero-actions hero-actions-product">
        <form
          className="hero-auth-fields hero-auth-fields-product hero-auth-fields-signin"
          onSubmit={handleSubmit}
        >
          <input
            aria-label={passwordPlaceholder}
            placeholder={passwordPlaceholder}
            value={password}
            type="password"
            autoComplete="current-password"
            onChange={(event) => onPasswordChange(event.target.value)}
          />
          <button
            className="button primary hero-primary-action"
            type="submit"
            disabled={isAuthLoading}
            data-action-id={actionIds.email}
          >
            {signInWithEmailLabel}
          </button>
        </form>
        <div className="hero-signin-actions">
          <button
            className="button ghost hero-inline-link"
            onClick={() => onEmailRecovery("email")}
            type="button"
            disabled={isAuthLoading}
            data-action-id={actionIds.recoverEmail}
          >
            {recoverByEmailLabel}
          </button>
        </div>
        <div className="hero-auth-divider" aria-hidden="true">
          <span>{dividerLabel}</span>
        </div>
        <button
          className="button ghost hero-provider-action"
          onClick={onAppleSignIn}
          type="button"
          disabled={isAuthLoading}
          data-action-id={actionIds.apple}
        >
          {signInWithAppleLabel}
        </button>
        {showStatus ? (
          <p className="hero-status" data-status-id={actionIds.status}>
            {authStatusLabel}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="hero-actions">
      <div className="hero-provider-actions">
        <button
          className="button primary hero-primary-action"
          onClick={onAppleSignIn}
          type="button"
          disabled={isAuthLoading}
          data-action-id={actionIds.apple}
        >
          {signInWithAppleLabel}
        </button>
        <button
          className="button ghost hero-provider-action"
          onClick={onGoogleSignIn}
          type="button"
          disabled={isAuthLoading}
          data-action-id={actionIds.google}
        >
          {signInWithGoogleLabel}
        </button>
      </div>
      <form className="inline-inputs hero-auth-fields" onSubmit={handleSubmit}>
        <input
          aria-label={emailPlaceholder}
          placeholder={emailPlaceholder}
          value={email}
          type="email"
          autoComplete="email"
          onChange={(event) => onEmailChange(event.target.value)}
        />
        <input
          aria-label={passwordPlaceholder}
          placeholder={passwordPlaceholder}
          value={password}
          type="password"
          autoComplete="current-password"
          onChange={(event) => onPasswordChange(event.target.value)}
        />
        <button
          className="button ghost"
          type="submit"
          disabled={isAuthLoading}
          data-action-id={actionIds.email}
        >
          {signInWithEmailLabel}
        </button>
      </form>
      <div className="inline-inputs hero-recovery-actions">
        <button
          className="button ghost"
          onClick={() => onEmailRecovery("email")}
          type="button"
          disabled={isAuthLoading}
          data-action-id={actionIds.recoverEmail}
        >
          {recoverByEmailLabel}
        </button>
        <button
          className="button ghost"
          onClick={() => onEmailRecovery("sms")}
          type="button"
          disabled={isAuthLoading}
          data-action-id={actionIds.recoverSMS}
        >
          {recoverBySMSLabel}
        </button>
      </div>
      {showStatus ? (
        <p className="hero-status" data-status-id={actionIds.status}>
          {authStatusLabel}
        </p>
      ) : null}
    </div>
  );
});
