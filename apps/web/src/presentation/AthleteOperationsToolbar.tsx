import { memo } from "react";

type AthleteSortMode = "sessions" | "athlete" | "lastSession";

type AthleteOperationsToolbarProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  searchLabel: string;
  searchValue: string;
  searchActionId: string;
  onSearchValueChange: (value: string) => void;
  sortLabel: string;
  sortValue: AthleteSortMode;
  sortActionId: string;
  onSortValueChange: (value: AthleteSortMode) => void;
  sortBySessionsLabel: string;
  sortByAthleteLabel: string;
  sortByLastSessionLabel: string;
  assignStarterPlanLabel: string;
  assignStarterPlanActionId: string;
  onAssignStarterPlan: () => void;
  clearSelectionLabel: string;
  clearSelectionActionId: string;
  onClearSelection: () => void;
  athletesLoadedLabel: string;
  athletesLoadedValue: string;
  athletesSelectedLabel: string;
  athletesSelectedValue: string;
};

export const AthleteOperationsToolbar = memo(function AthleteOperationsToolbar({
  screenId,
  routeId,
  statusId,
  searchLabel,
  searchValue,
  searchActionId,
  onSearchValueChange,
  sortLabel,
  sortValue,
  sortActionId,
  onSortValueChange,
  sortBySessionsLabel,
  sortByAthleteLabel,
  sortByLastSessionLabel,
  assignStarterPlanLabel,
  assignStarterPlanActionId,
  onAssignStarterPlan,
  clearSelectionLabel,
  clearSelectionActionId,
  onClearSelection,
  athletesLoadedLabel,
  athletesLoadedValue,
  athletesSelectedLabel,
  athletesSelectedValue
}: AthleteOperationsToolbarProps) {
  return (
    <>
      <div className="inline-inputs" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
        <input
          aria-label={searchLabel}
          data-action-id={searchActionId}
          placeholder={searchLabel}
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
        />
        <label className="compact-label">
          {sortLabel}
          <select
            aria-label={sortLabel}
            data-action-id={sortActionId}
            value={sortValue}
            onChange={(event) => onSortValueChange(event.target.value as AthleteSortMode)}
          >
            <option value="sessions">{sortBySessionsLabel}</option>
            <option value="athlete">{sortByAthleteLabel}</option>
            <option value="lastSession">{sortByLastSessionLabel}</option>
          </select>
        </label>
      </div>
      <div className="inline-inputs">
        <button
          className="button primary"
          data-action-id={assignStarterPlanActionId}
          onClick={onAssignStarterPlan}
          type="button"
        >
          {assignStarterPlanLabel}
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
      <p className="stat-line">
        <span>{athletesLoadedLabel}</span>
        <strong>{athletesLoadedValue}</strong>
      </p>
      <p className="stat-line">
        <span>{athletesSelectedLabel}</span>
        <strong>{athletesSelectedValue}</strong>
      </p>
    </>
  );
});
