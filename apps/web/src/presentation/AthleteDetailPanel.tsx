import { memo } from "react";
import type { AthleteOperationsRow, AthleteRiskLevel } from "./core-operations";

type AthleteDetailPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  emptyLabel: string;
  selectedRow: AthleteOperationsRow | null;
  plansLabel: string;
  sessionsLabel: string;
  nutritionLabel: string;
  lastSessionLabel: string;
  riskNormalLabel: string;
  riskAttentionLabel: string;
  selectFirstAthleteLabel: string;
  selectFirstAthleteActionId: string;
  onSelectFirstAthlete: () => void;
  openSessionHistoryLabel: string;
  openSessionHistoryActionId: string;
  onOpenSessionHistory: () => void;
  clearSelectionLabel: string;
  clearSelectionActionId: string;
  onClearSelection: () => void;
};

function riskToStatusClass(riskLevel: AthleteRiskLevel): string {
  return riskLevel === "normal" ? "positive" : "critical";
}

export const AthleteDetailPanel = memo(function AthleteDetailPanel({
  screenId,
  routeId,
  statusId,
  title,
  emptyLabel,
  selectedRow,
  plansLabel,
  sessionsLabel,
  nutritionLabel,
  lastSessionLabel,
  riskNormalLabel,
  riskAttentionLabel,
  selectFirstAthleteLabel,
  selectFirstAthleteActionId,
  onSelectFirstAthlete,
  openSessionHistoryLabel,
  openSessionHistoryActionId,
  onOpenSessionHistory,
  clearSelectionLabel,
  clearSelectionActionId,
  onClearSelection
}: AthleteDetailPanelProps) {
  return (
    <div className="history-list" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      {selectedRow === null ? (
        <p className="empty-state">{emptyLabel}</p>
      ) : (
        <article className="history-item">
          <strong>{selectedRow.athleteId}</strong>
          <div className="history-values">
            <span>
              {plansLabel} {selectedRow.plansCount}
            </span>
            <span>
              {sessionsLabel} {selectedRow.sessionsCount}
            </span>
            <span>
              {nutritionLabel} {selectedRow.nutritionLogsCount}
            </span>
            <span>
              {lastSessionLabel} {selectedRow.lastSessionDate}
            </span>
          </div>
          <span className={`status-pill status-${riskToStatusClass(selectedRow.riskLevel)}`}>
            {selectedRow.riskLevel === "normal" ? riskNormalLabel : riskAttentionLabel}
          </span>
        </article>
      )}
      <div className="inline-inputs">
        <button
          className="button primary"
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
        <button
          className="button ghost"
          data-action-id={clearSelectionActionId}
          onClick={onClearSelection}
          type="button"
        >
          {clearSelectionLabel}
        </button>
      </div>
    </div>
  );
});
