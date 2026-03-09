import { memo } from "react";

type SortOption = {
  value: string;
  label: string;
};

type DailyLogReviewPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  dateFilterPlaceholder: string;
  dateFilterValue: string;
  onDateFilterChange: (value: string) => void;
  minProteinPlaceholder: string;
  minProteinValue: string;
  onMinProteinChange: (value: string) => void;
  maxCaloriesPlaceholder: string;
  maxCaloriesValue: string;
  onMaxCaloriesChange: (value: string) => void;
  sortLabel: string;
  sortValue: string;
  sortOptions: SortOption[];
  onSortChange: (value: string) => void;
  clearFiltersLabel: string;
  clearFiltersActionId: string;
  onClearFilters: () => void;
  updateFiltersActionId: string;
  updateSortActionId: string;
  logsLoadedLabel: string;
  logsLoadedValue: string;
  filteredLogsLabel: string;
  filteredLogsValue: string;
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

export const DailyLogReviewPanel = memo(function DailyLogReviewPanel({
  screenId,
  routeId,
  statusId,
  title,
  dateFilterPlaceholder,
  dateFilterValue,
  onDateFilterChange,
  minProteinPlaceholder,
  minProteinValue,
  onMinProteinChange,
  maxCaloriesPlaceholder,
  maxCaloriesValue,
  onMaxCaloriesChange,
  sortLabel,
  sortValue,
  sortOptions,
  onSortChange,
  clearFiltersLabel,
  clearFiltersActionId,
  onClearFilters,
  updateFiltersActionId,
  updateSortActionId,
  logsLoadedLabel,
  logsLoadedValue,
  filteredLogsLabel,
  filteredLogsValue
}: DailyLogReviewPanelProps) {
  return (
    <>
      <div
        className="history-list"
        data-screen-id={screenId}
        data-route-id={routeId}
        data-status-id={statusId}
      >
        <p className="section-subtitle">{title}</p>
        <div className="inline-inputs">
          <input
            aria-label={dateFilterPlaceholder}
            placeholder={dateFilterPlaceholder}
            value={dateFilterValue}
            data-action-id={updateFiltersActionId}
            onChange={(event) => onDateFilterChange(event.target.value)}
          />
          <input
            aria-label={minProteinPlaceholder}
            placeholder={minProteinPlaceholder}
            value={minProteinValue}
            data-action-id={updateFiltersActionId}
            onChange={(event) => onMinProteinChange(event.target.value)}
          />
          <input
            aria-label={maxCaloriesPlaceholder}
            placeholder={maxCaloriesPlaceholder}
            value={maxCaloriesValue}
            data-action-id={updateFiltersActionId}
            onChange={(event) => onMaxCaloriesChange(event.target.value)}
          />
        </div>
        <div className="inline-inputs">
          <label className="compact-label">
            {sortLabel}
            <select
              aria-label={sortLabel}
              value={sortValue}
              data-action-id={updateSortActionId}
              onChange={(event) => onSortChange(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            className="button ghost"
            onClick={onClearFilters}
            type="button"
            data-action-id={clearFiltersActionId}
          >
            {clearFiltersLabel}
          </button>
        </div>
      </div>
      <StatLine label={logsLoadedLabel} value={logsLoadedValue} />
      <StatLine label={filteredLogsLabel} value={filteredLogsValue} />
    </>
  );
});
