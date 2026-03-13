import { memo } from "react";

type AccessGateCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  summary: string;
  hint: string;
  signInWithAppleLabel: string;
  signInWithGoogleLabel: string;
  signInWithEmailLabel: string;
  appleActionId: string;
  googleActionId: string;
  emailActionId: string;
  onAppleSignIn: () => void;
  onGoogleSignIn: () => void;
  onEmailSignIn: () => void;
};

export const AccessGateCard = memo(function AccessGateCard({
  screenId,
  routeId,
  title,
  summary,
  hint,
  signInWithAppleLabel,
  signInWithGoogleLabel,
  signInWithEmailLabel,
  appleActionId,
  googleActionId,
  emailActionId,
  onAppleSignIn,
  onGoogleSignIn,
  onEmailSignIn
}: AccessGateCardProps) {
  return (
    <article
      className="module-card access-gate-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id="web.accessGate.status"
      aria-live="polite"
    >
      <header className="module-header">
        <h2>{title}</h2>
      </header>
      <div className="form-grid">
        <p className="runtime-state-copy">{summary}</p>
        <div className="inline-inputs">
          <button
            className="button primary"
            onClick={onAppleSignIn}
            type="button"
            data-action-id={appleActionId}
          >
            {signInWithAppleLabel}
          </button>
          <button
            className="button ghost"
            onClick={onGoogleSignIn}
            type="button"
            data-action-id={googleActionId}
          >
            {signInWithGoogleLabel}
          </button>
          <button
            className="button ghost"
            onClick={onEmailSignIn}
            type="button"
            data-action-id={emailActionId}
          >
            {signInWithEmailLabel}
          </button>
        </div>
        <p className="empty-state">{hint}</p>
      </div>
    </article>
  );
});
