import { memo } from "react";
import type { AthleteOperationsRow, AthleteRiskLevel } from "./core-operations";

type AthletesOperationsTablePanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  rows: AthleteOperationsRow[];
  selectedAthleteIds: Set<string>;
  onToggleAthleteSelection: (athleteId: string) => void;
  athleteColumnLabel: string;
  plansColumnLabel: string;
  sessionsColumnLabel: string;
  nutritionColumnLabel: string;
  lastSessionColumnLabel: string;
  riskColumnLabel: string;
  riskNormalLabel: string;
  riskAttentionLabel: string;
  emptyLabel: string;
  rowsInfoLabel: string;
  hasMoreRows: boolean;
  loadMoreRowsLabel: string;
  loadMoreRowsActionId: string;
  onLoadMoreRows: () => void;
  showAllRowsLabel: string;
  showAllRowsActionId: string;
  onShowAllRows: () => void;
};

function riskToStatusClass(riskLevel: AthleteRiskLevel): string {
  return riskLevel === "normal" ? "positive" : "critical";
}

export const AthletesOperationsTablePanel = memo(function AthletesOperationsTablePanel({
  screenId,
  routeId,
  statusId,
  rows,
  selectedAthleteIds,
  onToggleAthleteSelection,
  athleteColumnLabel,
  plansColumnLabel,
  sessionsColumnLabel,
  nutritionColumnLabel,
  lastSessionColumnLabel,
  riskColumnLabel,
  riskNormalLabel,
  riskAttentionLabel,
  emptyLabel,
  rowsInfoLabel,
  hasMoreRows,
  loadMoreRowsLabel,
  loadMoreRowsActionId,
  onLoadMoreRows,
  showAllRowsLabel,
  showAllRowsActionId,
  onShowAllRows
}: AthletesOperationsTablePanelProps) {
  return (
    <div data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      {rows.length === 0 ? (
        <p className="empty-state">{emptyLabel}</p>
      ) : (
        <>
          <p className="dense-table-info">{rowsInfoLabel}</p>
          <div className="operations-table">
            <header className="operations-table-row operations-table-header">
              <span>{athleteColumnLabel}</span>
              <span>{plansColumnLabel}</span>
              <span>{sessionsColumnLabel}</span>
              <span>{nutritionColumnLabel}</span>
              <span>{lastSessionColumnLabel}</span>
              <span>{riskColumnLabel}</span>
            </header>
            {rows.map((row) => (
              <label key={row.athleteId} className="operations-table-row">
                <div className="operations-athlete-cell">
                  <input
                    type="checkbox"
                    checked={selectedAthleteIds.has(row.athleteId)}
                    onChange={() => onToggleAthleteSelection(row.athleteId)}
                  />
                  <strong>{row.athleteId}</strong>
                </div>
                <span>{row.plansCount}</span>
                <span>{row.sessionsCount}</span>
                <span>{row.nutritionLogsCount}</span>
                <span>{row.lastSessionDate}</span>
                <span className={`status-pill status-${riskToStatusClass(row.riskLevel)}`}>
                  {row.riskLevel === "normal" ? riskNormalLabel : riskAttentionLabel}
                </span>
              </label>
            ))}
          </div>
          {hasMoreRows ? (
            <div className="dense-table-actions">
              <button
                className="button ghost"
                data-action-id={loadMoreRowsActionId}
                onClick={onLoadMoreRows}
                type="button"
              >
                {loadMoreRowsLabel}
              </button>
              <button
                className="button ghost"
                data-action-id={showAllRowsActionId}
                onClick={onShowAllRows}
                type="button"
              >
                {showAllRowsLabel}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
});
