import { memo } from "react";

type SelectedAthleteRow = {
  athleteId: string;
  sessionsCount: number;
  plansCount: number;
};

type PlanAssignmentPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  statusLabel: string;
  statusClass: string;
  statusValue: string;
  showStatus: boolean;
  summary: string;
  planLabel: string;
  planValue: string;
  selectedAthletesLabel: string;
  selectedAthletesValue: string;
  atRiskAthletesLabel: string;
  atRiskAthletesValue: string;
  assignSelectedLabel: string;
  assignSelectedActionId: string;
  onAssignSelected: () => void;
  assignSelectedDisabled: boolean;
  assignAtRiskLabel: string;
  assignAtRiskActionId: string;
  onAssignAtRisk: () => void;
  assignAtRiskDisabled: boolean;
  clearLabel: string;
  clearActionId: string;
  onClear: () => void;
  clearDisabled: boolean;
  noSelectionLabel: string;
  selectedListTitle: string;
  selectedRows: SelectedAthleteRow[];
  sessionsLabel: string;
  plansLabel: string;
};

export const PlanAssignmentPanel = memo(function PlanAssignmentPanel({
  screenId,
  routeId,
  statusId,
  title,
  statusLabel,
  statusClass,
  statusValue,
  showStatus,
  summary,
  planLabel,
  planValue,
  selectedAthletesLabel,
  selectedAthletesValue,
  atRiskAthletesLabel,
  atRiskAthletesValue,
  assignSelectedLabel,
  assignSelectedActionId,
  onAssignSelected,
  assignSelectedDisabled,
  assignAtRiskLabel,
  assignAtRiskActionId,
  onAssignAtRisk,
  assignAtRiskDisabled,
  clearLabel,
  clearActionId,
  onClear,
  clearDisabled,
  noSelectionLabel,
  selectedListTitle,
  selectedRows,
  sessionsLabel,
  plansLabel
}: PlanAssignmentPanelProps) {
  return (
    <div className="history-list" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <header className="module-header">
        <h2>{title}</h2>
        {showStatus ? (
          <p>
            {statusLabel}: <span className={`status-pill status-${statusClass}`}>{statusValue}</span>
          </p>
        ) : null}
      </header>
      <p>{summary}</p>
      <div className="inline-inputs">
        <article className="metric-item">
          <p>{planLabel}</p>
          <strong>{planValue}</strong>
        </article>
        <article className="metric-item">
          <p>{selectedAthletesLabel}</p>
          <strong>{selectedAthletesValue}</strong>
        </article>
        <article className="metric-item">
          <p>{atRiskAthletesLabel}</p>
          <strong>{atRiskAthletesValue}</strong>
        </article>
      </div>
      <div className="inline-inputs">
        <button
          className="button primary"
          onClick={onAssignSelected}
          type="button"
          data-action-id={assignSelectedActionId}
          disabled={assignSelectedDisabled}
        >
          {assignSelectedLabel}
        </button>
        <button
          className="button ghost"
          onClick={onAssignAtRisk}
          type="button"
          data-action-id={assignAtRiskActionId}
          disabled={assignAtRiskDisabled}
        >
          {assignAtRiskLabel}
        </button>
        <button
          className="button ghost"
          onClick={onClear}
          type="button"
          data-action-id={clearActionId}
          disabled={clearDisabled}
        >
          {clearLabel}
        </button>
      </div>
      {selectedRows.length === 0 ? (
        <p className="empty-state">{noSelectionLabel}</p>
      ) : (
        <>
          <p className="section-subtitle">{selectedListTitle}</p>
          <div className="choice-list">
            {selectedRows.map((row) => (
              <label key={row.athleteId}>
                <span>{row.athleteId}</span>
                <span>
                  {sessionsLabel} {row.sessionsCount} · {plansLabel} {row.plansCount}
                </span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
});
