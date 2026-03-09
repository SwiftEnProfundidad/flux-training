import { memo } from "react";

type DashboardKpisCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  planLabel: string;
  planValue: string;
  sessionLabel: string;
  sessionValue: string;
  nutritionLabel: string;
  nutritionValue: string;
  recommendationsLabel: string;
  recommendationsValue: string;
  openAlertsLabel: string;
  openAlertsValue: string;
  queueLabel: string;
  queueValue: string;
  refreshActionId: string;
  refreshLabel: string;
  refreshDisabled: boolean;
  onRefresh: () => void;
};

export const DashboardKpisCard = memo(function DashboardKpisCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  planLabel,
  planValue,
  sessionLabel,
  sessionValue,
  nutritionLabel,
  nutritionValue,
  recommendationsLabel,
  recommendationsValue,
  openAlertsLabel,
  openAlertsValue,
  queueLabel,
  queueValue,
  refreshActionId,
  refreshLabel,
  refreshDisabled,
  onRefresh
}: DashboardKpisCardProps) {
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
            <p>{planLabel}</p>
            <strong>{planValue}</strong>
          </article>
          <article className="metric-item">
            <p>{sessionLabel}</p>
            <strong>{sessionValue}</strong>
          </article>
          <article className="metric-item">
            <p>{nutritionLabel}</p>
            <strong>{nutritionValue}</strong>
          </article>
          <article className="metric-item">
            <p>{recommendationsLabel}</p>
            <strong>{recommendationsValue}</strong>
          </article>
          <article className="metric-item">
            <p>{openAlertsLabel}</p>
            <strong>{openAlertsValue}</strong>
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
