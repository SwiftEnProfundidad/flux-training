import { memo } from "react";

type QuickActionsCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  runAllActionId: string;
  runAllLabel: string;
  runAllDisabled: boolean;
  onRunAll: () => void;
  refreshActionId: string;
  refreshLabel: string;
  refreshDisabled: boolean;
  onRefresh: () => void;
  loadPlansActionId: string;
  loadPlansLabel: string;
  onLoadPlans: () => void;
  loadSessionsActionId: string;
  loadSessionsLabel: string;
  onLoadSessions: () => void;
  loadRecommendationsActionId: string;
  loadRecommendationsLabel: string;
  onLoadRecommendations: () => void;
};

export const QuickActionsCard = memo(function QuickActionsCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  runAllActionId,
  runAllLabel,
  runAllDisabled,
  onRunAll,
  refreshActionId,
  refreshLabel,
  refreshDisabled,
  onRefresh,
  loadPlansActionId,
  loadPlansLabel,
  onLoadPlans,
  loadSessionsActionId,
  loadSessionsLabel,
  onLoadSessions,
  loadRecommendationsActionId,
  loadRecommendationsLabel,
  onLoadRecommendations
}: QuickActionsCardProps) {
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
          <button
            className="button primary"
            type="button"
            data-action-id={runAllActionId}
            onClick={onRunAll}
            disabled={runAllDisabled}
          >
            {runAllLabel}
          </button>
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
        <div className="inline-inputs">
          <button className="button ghost" type="button" data-action-id={loadPlansActionId} onClick={onLoadPlans}>
            {loadPlansLabel}
          </button>
          <button
            className="button ghost"
            type="button"
            data-action-id={loadSessionsActionId}
            onClick={onLoadSessions}
          >
            {loadSessionsLabel}
          </button>
          <button
            className="button ghost"
            type="button"
            data-action-id={loadRecommendationsActionId}
            onClick={onLoadRecommendations}
          >
            {loadRecommendationsLabel}
          </button>
        </div>
      </div>
    </article>
  );
});
