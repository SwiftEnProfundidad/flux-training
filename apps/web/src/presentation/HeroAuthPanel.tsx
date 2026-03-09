import { memo, type FormEvent } from "react";

interface HeroAuthPanelProps {
  isAuthLoading: boolean;
  email: string;
  password: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  signInWithAppleLabel: string;
  signInWithEmailLabel: string;
  recoverByEmailLabel: string;
  recoverBySMSLabel: string;
  authStatusLabel: string;
  actionIds: {
    apple: string;
    email: string;
    recoverEmail: string;
    recoverSMS: string;
    status: string;
  };
  onAppleSignIn: () => void;
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
  signInWithEmailLabel,
  recoverByEmailLabel,
  recoverBySMSLabel,
  authStatusLabel,
  actionIds,
  onAppleSignIn,
  onEmailChange,
  onPasswordChange,
  onEmailSignIn,
  onEmailRecovery
}: HeroAuthPanelProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onEmailSignIn();
  }

  return (
    <div className="hero-actions">
      <button
        className="button primary hero-primary-action"
        onClick={onAppleSignIn}
        type="button"
        disabled={isAuthLoading}
        data-action-id={actionIds.apple}
      >
        {signInWithAppleLabel}
      </button>
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
      <p className="hero-status" data-status-id={actionIds.status}>
        {authStatusLabel}
      </p>
    </div>
  );
});
