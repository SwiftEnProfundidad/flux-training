import { memo } from "react";

type ReadinessMonitorCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  scoreLabel: string;
  scoreValue: string;
  readinessLabel: string;
  readinessValue: string;
  authLabel: string;
  authValue: string;
  queueLabel: string;
  queueValue: string;
  refreshActionId: string;
  refreshLabel: string;
  refreshDisabled: boolean;
  onRefresh: () => void;
};

export const ReadinessMonitorCard = memo(function ReadinessMonitorCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  scoreLabel,
  scoreValue,
  readinessLabel,
  readinessValue,
  authLabel,
  authValue,
  queueLabel,
  queueValue,
  refreshActionId,
  refreshLabel,
  refreshDisabled,
  onRefresh
}: ReadinessMonitorCardProps) {
  return (
    <article
      className="module-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id={`${screenId}.status`}
    >
      <header className="module-header">
        <h2>{title}</h2>
        <p>
          {statusLabel}: <span className={`status-pill status-${statusClass}`}>{statusValue}</span>
        </p>
      </header>
      <div className="form-grid">
        <p className="runtime-state-copy">{summary}</p>
        <div className="inline-inputs">
          <article className="metric-item">
            <p>{scoreLabel}</p>
            <strong>{scoreValue}</strong>
          </article>
          <article className="metric-item">
            <p>{readinessLabel}</p>
            <strong>{readinessValue}</strong>
          </article>
          <article className="metric-item">
            <p>{authLabel}</p>
            <strong>{authValue}</strong>
          </article>
          <article className="metric-item">
            <p>{queueLabel}</p>
            <strong>{queueValue}</strong>
          </article>
        </div>
        <button
          className="button ghost"
          type="button"
          data-action-id={refreshActionId}
          onClick={onRefresh}
          disabled={refreshDisabled}
        >
          {refreshLabel}
        </button>
      </div>
    </article>
  );
});
