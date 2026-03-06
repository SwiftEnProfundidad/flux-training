import { memo } from "react";
import type { AIRecommendation } from "@flux/contracts";

type AIInsightsPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  summary: string;
  loadActionLabel: string;
  loadActionId: string;
  onLoadRecommendations: () => void;
  refreshActionLabel: string;
  refreshActionId: string;
  onRefreshSignals: () => void;
  refreshDisabled: boolean;
  recommendationsMetricLabel: string;
  recommendationsMetricValue: string;
  highPriorityMetricLabel: string;
  highPriorityMetricValue: string;
  signalsMetricLabel: string;
  signalsMetricValue: string;
  emptyLabel: string;
  recommendations: AIRecommendation[];
  priorityClassName: (priority: AIRecommendation["priority"]) => string;
};

type MetricCardProps = {
  title: string;
  value: string;
};

const MetricCard = memo(function MetricCard({ title, value }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
});

export const AIInsightsPanel = memo(function AIInsightsPanel({
  screenId,
  routeId,
  statusId,
  title,
  summary,
  loadActionLabel,
  loadActionId,
  onLoadRecommendations,
  refreshActionLabel,
  refreshActionId,
  onRefreshSignals,
  refreshDisabled,
  recommendationsMetricLabel,
  recommendationsMetricValue,
  highPriorityMetricLabel,
  highPriorityMetricValue,
  signalsMetricLabel,
  signalsMetricValue,
  emptyLabel,
  recommendations,
  priorityClassName
}: AIInsightsPanelProps) {
  return (
    <div className="form-grid" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="runtime-state-copy">{summary}</p>
      <div className="inline-inputs">
        <button
          className="button primary"
          onClick={onLoadRecommendations}
          type="button"
          data-action-id={loadActionId}
        >
          {loadActionLabel}
        </button>
        <button
          className="button ghost"
          onClick={onRefreshSignals}
          type="button"
          data-action-id={refreshActionId}
          disabled={refreshDisabled}
        >
          {refreshActionLabel}
        </button>
      </div>
      <div className="inline-inputs">
        <MetricCard title={recommendationsMetricLabel} value={recommendationsMetricValue} />
        <MetricCard title={highPriorityMetricLabel} value={highPriorityMetricValue} />
        <MetricCard title={signalsMetricLabel} value={signalsMetricValue} />
      </div>
      {recommendations.length === 0 ? (
        <p className="empty-state">{emptyLabel}</p>
      ) : (
        <div className="recommendation-list">
          {recommendations.map((recommendation) => (
            <article key={recommendation.id} className="recommendation-item">
              <div className="recommendation-head">
                <strong>{recommendation.title}</strong>
                <span className={`status-pill status-${priorityClassName(recommendation.priority)}`}>
                  {recommendation.priority}
                </span>
              </div>
              <p>{recommendation.rationale}</p>
              <div className="recommendation-meta">
                <span>{recommendation.category}</span>
                <span>{recommendation.expectedImpact}</span>
                <strong>{recommendation.actionLabel}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
});
