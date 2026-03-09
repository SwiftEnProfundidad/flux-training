import { memo } from "react";

type CohortRow = {
  id: string;
  athleteId: string;
  plansCount: number;
  sessionsCount: number;
  nutritionLogsCount: number;
  riskLevel: string;
};

type CohortAnalysisCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  sizeLabel: string;
  sizeValue: string;
  attentionLabel: string;
  attentionValue: string;
  normalLabel: string;
  normalValue: string;
  averageSessionsLabel: string;
  averageSessionsValue: string;
  refreshActionId: string;
  refreshLabel: string;
  onRefresh: () => void;
  refreshDisabled: boolean;
  emptyLabel: string;
  athleteLabel: string;
  plansLabel: string;
  sessionsLabel: string;
  nutritionLabel: string;
  riskLabel: string;
  rows: CohortRow[];
};

export const CohortAnalysisCard = memo(function CohortAnalysisCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  sizeLabel,
  sizeValue,
  attentionLabel,
  attentionValue,
  normalLabel,
  normalValue,
  averageSessionsLabel,
  averageSessionsValue,
  refreshActionId,
  refreshLabel,
  onRefresh,
  refreshDisabled,
  emptyLabel,
  athleteLabel,
  plansLabel,
  sessionsLabel,
  nutritionLabel,
  riskLabel,
  rows
}: CohortAnalysisCardProps) {
  return (
    <article
      className="module-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id="web.cohortAnalysis.status"
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
            <p>{sizeLabel}</p>
            <strong>{sizeValue}</strong>
          </article>
          <article className="metric-item">
            <p>{attentionLabel}</p>
            <strong>{attentionValue}</strong>
          </article>
          <article className="metric-item">
            <p>{normalLabel}</p>
            <strong>{normalValue}</strong>
          </article>
          <article className="metric-item">
            <p>{averageSessionsLabel}</p>
            <strong>{averageSessionsValue}</strong>
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
        {rows.length === 0 ? (
          <p className="empty-state">{emptyLabel}</p>
        ) : (
          <div className="dense-table">
            <table>
              <thead>
                <tr>
                  <th>{athleteLabel}</th>
                  <th>{plansLabel}</th>
                  <th>{sessionsLabel}</th>
                  <th>{nutritionLabel}</th>
                  <th>{riskLabel}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.athleteId}</td>
                    <td>{row.plansCount}</td>
                    <td>{row.sessionsCount}</td>
                    <td>{row.nutritionLogsCount}</td>
                    <td>{row.riskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
});
