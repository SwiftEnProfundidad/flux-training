import { memo } from "react";

type SessionActionsPanelProps = {
  logWorkoutLabel: string;
  onLogWorkout: () => void;
  loadSessionsLabel: string;
  loadSessionsActionId: string;
  onLoadSessions: () => void;
  sessionStatusLabel: string;
  sessionStatusValue: string;
  sessionsLoadedLabel: string;
  sessionsLoadedValue: string;
};

export const SessionActionsPanel = memo(function SessionActionsPanel({
  logWorkoutLabel,
  onLogWorkout,
  loadSessionsLabel,
  loadSessionsActionId,
  onLoadSessions,
  sessionStatusLabel,
  sessionStatusValue,
  sessionsLoadedLabel,
  sessionsLoadedValue
}: SessionActionsPanelProps) {
  return (
    <>
      <div className="inline-inputs">
        <button className="button primary" onClick={onLogWorkout} type="button">
          {logWorkoutLabel}
        </button>
        <button
          className="button ghost"
          onClick={onLoadSessions}
          type="button"
          data-action-id={loadSessionsActionId}
        >
          {loadSessionsLabel}
        </button>
      </div>
      <p className="stat-line">
        <span>{sessionStatusLabel}</span>
        <strong>{sessionStatusValue}</strong>
      </p>
      <p className="stat-line">
        <span>{sessionsLoadedLabel}</span>
        <strong>{sessionsLoadedValue}</strong>
      </p>
    </>
  );
});
