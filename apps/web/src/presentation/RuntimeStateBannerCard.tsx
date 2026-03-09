import { memo } from "react";

type RuntimeStateBannerCardProps = {
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  copy: string;
  actionLabel: string;
  onRecover: () => void;
};

export const RuntimeStateBannerCard = memo(function RuntimeStateBannerCard({
  title,
  statusLabel,
  statusValue,
  statusClass,
  copy,
  actionLabel,
  onRecover
}: RuntimeStateBannerCardProps) {
  return (
    <article className={`module-card runtime-state-banner state-${statusClass}`}>
      <header className="module-header">
        <h2>{title}</h2>
        <p>
          {statusLabel}: <span className={`status-pill status-${statusClass}`}>{statusValue}</span>
        </p>
      </header>
      <div className="form-grid">
        <p className="runtime-state-copy">{copy}</p>
        <button className="button primary" onClick={onRecover} type="button">
          {actionLabel}
        </button>
      </div>
    </article>
  );
});
