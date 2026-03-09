import { memo } from "react";
import type { NutritionLog } from "@flux/contracts";

type NutritionLogDetailRow = {
  key: string;
  log: NutritionLog;
};

type NutritionLogDetailPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  summary: string;
  loadLabel: string;
  loadActionId: string;
  onLoad: () => void;
  loadDisabled: boolean;
  clearLabel: string;
  clearActionId: string;
  onClearSelection: () => void;
  openCoachLabel: string;
  openCoachActionId: string;
  onOpenCoachView: () => void;
  selectLabel: string;
  selectActionId: string;
  selectedOptionKey: string;
  onSelectLog: (value: string) => void;
  optionRows: NutritionLogDetailRow[];
  selectedDateLabel: string;
  selectedDateValue: string;
  selectedAthleteLabel: string;
  selectedAthleteValue: string;
  noSelectionLabel: string;
  selectedLog: NutritionLog | null;
  caloriesLabel: string;
  proteinLabel: string;
  carbsLabel: string;
  fatsLabel: string;
};

type StatLineProps = {
  label: string;
  value: string;
};

function StatLine({ label, value }: StatLineProps) {
  return (
    <p className="history-item-head">
      <span>{label}</span>
      <strong>{value}</strong>
    </p>
  );
}

export const NutritionLogDetailPanel = memo(function NutritionLogDetailPanel({
  screenId,
  routeId,
  statusId,
  title,
  summary,
  loadLabel,
  loadActionId,
  onLoad,
  loadDisabled,
  clearLabel,
  clearActionId,
  onClearSelection,
  openCoachLabel,
  openCoachActionId,
  onOpenCoachView,
  selectLabel,
  selectActionId,
  selectedOptionKey,
  onSelectLog,
  optionRows,
  selectedDateLabel,
  selectedDateValue,
  selectedAthleteLabel,
  selectedAthleteValue,
  noSelectionLabel,
  selectedLog,
  caloriesLabel,
  proteinLabel,
  carbsLabel,
  fatsLabel
}: NutritionLogDetailPanelProps) {
  return (
    <>
      <div
        className="history-list"
        data-screen-id={screenId}
        data-route-id={routeId}
        data-status-id={statusId}
      >
        <p className="section-subtitle">{title}</p>
        <p className="runtime-state-copy">{summary}</p>
        <div className="inline-inputs">
          <button
            className="button primary"
            onClick={onLoad}
            type="button"
            data-action-id={loadActionId}
            disabled={loadDisabled}
          >
            {loadLabel}
          </button>
          <button
            className="button ghost"
            onClick={onClearSelection}
            type="button"
            data-action-id={clearActionId}
          >
            {clearLabel}
          </button>
          <button
            className="button ghost"
            onClick={onOpenCoachView}
            type="button"
            data-action-id={openCoachActionId}
          >
            {openCoachLabel}
          </button>
        </div>
        <label className="compact-label">
          {selectLabel}
          <select
            aria-label={selectLabel}
            value={selectedOptionKey}
            onChange={(event) => onSelectLog(event.target.value)}
            data-action-id={selectActionId}
          >
            {optionRows.map((row) => (
              <option key={row.key} value={row.key}>
                {row.log.date} · {row.log.userId}
              </option>
            ))}
          </select>
        </label>
        <StatLine label={selectedDateLabel} value={selectedDateValue} />
        <StatLine label={selectedAthleteLabel} value={selectedAthleteValue} />
        {selectedLog === null ? (
          <p className="empty-state">{noSelectionLabel}</p>
        ) : (
          <div className="history-values">
            <span>{caloriesLabel} {selectedLog.calories}</span>
            <span>{proteinLabel} {selectedLog.proteinGrams}</span>
            <span>{carbsLabel} {selectedLog.carbsGrams}</span>
            <span>{fatsLabel} {selectedLog.fatsGrams}</span>
          </div>
        )}
      </div>
      {optionRows.length > 0 ? (
        <div className="history-list">
          {optionRows.map((row) => (
            <article key={row.key} className="history-item">
              <strong>{row.log.date}</strong>
              <div className="history-values">
                <span>{caloriesLabel} {row.log.calories}</span>
                <span>{proteinLabel} {row.log.proteinGrams}</span>
                <span>{carbsLabel} {row.log.carbsGrams}</span>
                <span>{fatsLabel} {row.log.fatsGrams}</span>
              </div>
              <button
                className="button ghost"
                type="button"
                onClick={() => onSelectLog(row.key)}
                data-action-id={selectActionId}
              >
                {selectLabel}
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </>
  );
});
