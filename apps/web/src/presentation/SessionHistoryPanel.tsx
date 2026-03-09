import { memo } from "react";

type SessionHistoryRow = {
  key: string;
  athleteId: string;
  planId: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  exercisesCount: number;
};

type SessionHistoryPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  sessionsLoadedLabel: string;
  sessionsLoadedValue: string;
  loadSessionsLabel: string;
  loadSessionsActionId: string;
  onLoadSessions: () => void;
  selectFirstAthleteLabel: string;
  selectFirstAthleteActionId: string;
  onSelectFirstAthlete: () => void;
  clearSelectionLabel: string;
  clearSelectionActionId: string;
  onClearSelection: () => void;
  hasSelection: boolean;
  hasRows: boolean;
  emptySelectionLabel: string;
  noRowsLabel: string;
  rows: SessionHistoryRow[];
  athleteLabel: string;
  planLabel: string;
  startedLabel: string;
  endedLabel: string;
  durationLabel: string;
  minutesLabel: string;
  exercisesLabel: string;
};

export const SessionHistoryPanel = memo(function SessionHistoryPanel({
  screenId,
  routeId,
  statusId,
  title,
  sessionsLoadedLabel,
  sessionsLoadedValue,
  loadSessionsLabel,
  loadSessionsActionId,
  onLoadSessions,
  selectFirstAthleteLabel,
  selectFirstAthleteActionId,
  onSelectFirstAthlete,
  clearSelectionLabel,
  clearSelectionActionId,
  onClearSelection,
  hasSelection,
  hasRows,
  emptySelectionLabel,
  noRowsLabel,
  rows,
  athleteLabel,
  planLabel,
  startedLabel,
  endedLabel,
  durationLabel,
  minutesLabel,
  exercisesLabel
}: SessionHistoryPanelProps) {
  return (
    <div className="history-list" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      <p className="stat-line">
        <span>{sessionsLoadedLabel}</span>
        <strong>{sessionsLoadedValue}</strong>
      </p>
      <div className="inline-inputs">
        <button
          className="button primary"
          data-action-id={loadSessionsActionId}
          onClick={onLoadSessions}
          type="button"
        >
          {loadSessionsLabel}
        </button>
        <button
          className="button ghost"
          data-action-id={selectFirstAthleteActionId}
          onClick={onSelectFirstAthlete}
          type="button"
        >
          {selectFirstAthleteLabel}
        </button>
        <button
          className="button ghost"
          data-action-id={clearSelectionActionId}
          onClick={onClearSelection}
          type="button"
        >
          {clearSelectionLabel}
        </button>
      </div>
      {!hasSelection ? (
        <p className="empty-state">{emptySelectionLabel}</p>
      ) : !hasRows ? (
        <p className="empty-state">{noRowsLabel}</p>
      ) : (
        rows.map((row) => (
          <article key={row.key} className="history-item">
            <strong>
              {athleteLabel} {row.athleteId}
            </strong>
            <div className="history-values">
              <span>
                {planLabel} {row.planId}
              </span>
              <span>
                {startedLabel} {row.startedAt}
              </span>
              <span>
                {endedLabel} {row.endedAt}
              </span>
              <span>
                {durationLabel} {row.durationMinutes} {minutesLabel}
              </span>
              <span>
                {exercisesLabel} {row.exercisesCount}
              </span>
            </div>
          </article>
        ))
      )}
    </div>
  );
});
