import { memo } from "react";
import type { AthleteOperationsRow } from "./core-operations";

type CompareProgressPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  loadProgressLabel: string;
  loadProgressActionId: string;
  onLoadProgress: () => void;
  selectFirstAthleteLabel: string;
  selectFirstAthleteActionId: string;
  onSelectFirstAthlete: () => void;
  openSessionHistoryLabel: string;
  openSessionHistoryActionId: string;
  onOpenSessionHistory: () => void;
  emptyLabel: string;
  selectedRow: AthleteOperationsRow | null;
  selectedSessionsLabel: string;
  cohortSessionsLabel: string;
  deltaSessionsLabel: string;
  selectedNutritionLabel: string;
  cohortNutritionLabel: string;
  deltaNutritionLabel: string;
  cohortAverageSessions: number;
  cohortAverageNutritionLogs: number;
};

function formatDelta(delta: number): string {
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}`;
}

export const CompareProgressPanel = memo(function CompareProgressPanel({
  screenId,
  routeId,
  statusId,
  title,
  loadProgressLabel,
  loadProgressActionId,
  onLoadProgress,
  selectFirstAthleteLabel,
  selectFirstAthleteActionId,
  onSelectFirstAthlete,
  openSessionHistoryLabel,
  openSessionHistoryActionId,
  onOpenSessionHistory,
  emptyLabel,
  selectedRow,
  selectedSessionsLabel,
  cohortSessionsLabel,
  deltaSessionsLabel,
  selectedNutritionLabel,
  cohortNutritionLabel,
  deltaNutritionLabel,
  cohortAverageSessions,
  cohortAverageNutritionLogs
}: CompareProgressPanelProps) {
  const sessionsDelta =
    selectedRow === null ? null : selectedRow.sessionsCount - cohortAverageSessions;
  const nutritionDelta =
    selectedRow === null ? null : selectedRow.nutritionLogsCount - cohortAverageNutritionLogs;

  return (
    <div className="history-list" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      <div className="inline-inputs">
        <button
          className="button primary"
          data-action-id={loadProgressActionId}
          onClick={onLoadProgress}
          type="button"
        >
          {loadProgressLabel}
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
          data-action-id={openSessionHistoryActionId}
          onClick={onOpenSessionHistory}
          type="button"
        >
          {openSessionHistoryLabel}
        </button>
      </div>
      {selectedRow === null ? (
        <p className="empty-state">{emptyLabel}</p>
      ) : (
        <>
          <p className="stat-line">
            <span>{selectedSessionsLabel}</span>
            <strong>{String(selectedRow.sessionsCount)}</strong>
          </p>
          <p className="stat-line">
            <span>{cohortSessionsLabel}</span>
            <strong>{String(cohortAverageSessions)}</strong>
          </p>
          <p className="stat-line">
            <span>{deltaSessionsLabel}</span>
            <strong>{sessionsDelta === null ? "-" : formatDelta(sessionsDelta)}</strong>
          </p>
          <p className="stat-line">
            <span>{selectedNutritionLabel}</span>
            <strong>{String(selectedRow.nutritionLogsCount)}</strong>
          </p>
          <p className="stat-line">
            <span>{cohortNutritionLabel}</span>
            <strong>{String(cohortAverageNutritionLogs)}</strong>
          </p>
          <p className="stat-line">
            <span>{deltaNutritionLabel}</span>
            <strong>{nutritionDelta === null ? "-" : formatDelta(nutritionDelta)}</strong>
          </p>
        </>
      )}
    </div>
  );
});
