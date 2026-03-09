import { memo } from "react";

type DashboardHomeCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  visibleModulesLabel: string;
  visibleModulesValue: string;
  activeDomainLabel: string;
  activeDomainValue: string;
  refreshActionId: string;
  refreshLabel: string;
  refreshDisabled: boolean;
  onRefresh: () => void;
};

export const DashboardHomeCard = memo(function DashboardHomeCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  visibleModulesLabel,
  visibleModulesValue,
  activeDomainLabel,
  activeDomainValue,
  refreshActionId,
  refreshLabel,
  refreshDisabled,
  onRefresh
}: DashboardHomeCardProps) {
  return (
    <article
      className="module-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id="web.dashboardHome.status"
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
            <p>{visibleModulesLabel}</p>
            <strong>{visibleModulesValue}</strong>
          </article>
          <article className="metric-item">
            <p>{activeDomainLabel}</p>
            <strong>{activeDomainValue}</strong>
          </article>
        </div>
        <button
          className="button ghost"
          onClick={onRefresh}
          type="button"
          data-action-id={refreshActionId}
          disabled={refreshDisabled}
        >
          {refreshLabel}
        </button>
      </div>
    </article>
  );
});
