import { memo } from "react";
import type { ProgressSummary } from "@flux/contracts";
import type { ProgressSortMode } from "./nutrition-progress-operations";

type ProgressHistoryEntry = {
  date: string;
  workoutSessions: number;
  trainingMinutes: number;
  completedSets: number;
  calories: number | null;
  effortScore: number;
};

type MetricItemProps = {
  title: string;
  value: string;
};

type ProgressTrendsPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  status: string;
  statusLabel: string;
  showStatus?: boolean;
  summary: string;
  refreshLabel: string;
  refreshActionId: string;
  onRefresh: () => void;
  refreshDisabled: boolean;
  progressSummary: ProgressSummary | null;
  noDataLabel: string;
  workoutsLabel: string;
  minutesLabel: string;
  setsLabel: string;
  nutritionLabel: string;
  avgCaloriesLabel: string;
  avgProteinLabel: string;
  filtersLabel: string;
  minSessionsPlaceholder: string;
  minSessionsValue: string;
  onMinSessionsChange: (value: string) => void;
  sortLabel: string;
  sortMode: ProgressSortMode;
  onSortModeChange: (value: ProgressSortMode) => void;
  sortByDateLabel: string;
  sortBySessionsLabel: string;
  sortByMinutesLabel: string;
  clearFiltersLabel: string;
  onClearFilters: () => void;
  filteredHistoryLabel: string;
  filteredHistoryValue: string;
  filteredHistory: ProgressHistoryEntry[];
  noFilteredHistoryLabel: string;
  historySessionsLabel: string;
  historyMinutesLabel: string;
  historySetsLabel: string;
  historyCaloriesLabel: string;
  effortLabel: string;
};

const MetricItem = memo(function MetricItem({ title, value }: MetricItemProps) {
  return (
    <article className="metric-card">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
});

export const ProgressTrendsPanel = memo(function ProgressTrendsPanel({
  screenId,
  routeId,
  statusId,
  title,
  status,
  statusLabel,
  showStatus = true,
  summary,
  refreshLabel,
  refreshActionId,
  onRefresh,
  refreshDisabled,
  progressSummary,
  noDataLabel,
  workoutsLabel,
  minutesLabel,
  setsLabel,
  nutritionLabel,
  avgCaloriesLabel,
  avgProteinLabel,
  filtersLabel,
  minSessionsPlaceholder,
  minSessionsValue,
  onMinSessionsChange,
  sortLabel,
  sortMode,
  onSortModeChange,
  sortByDateLabel,
  sortBySessionsLabel,
  sortByMinutesLabel,
  clearFiltersLabel,
  onClearFilters,
  filteredHistoryLabel,
  filteredHistoryValue,
  filteredHistory,
  noFilteredHistoryLabel,
  historySessionsLabel,
  historyMinutesLabel,
  historySetsLabel,
  historyCaloriesLabel,
  effortLabel
}: ProgressTrendsPanelProps) {
  return (
    <article
      className="module-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id={statusId}
    >
      <div className="module-header">
        <h2>{title}</h2>
        {showStatus ? <span>{statusLabel}: {status}</span> : null}
      </div>
      <div className="form-grid">
        <p className="runtime-state-copy">{summary}</p>
        <button
          className="button primary"
          onClick={onRefresh}
          type="button"
          data-action-id={refreshActionId}
          disabled={refreshDisabled}
        >
          {refreshLabel}
        </button>
        {progressSummary === null ? (
          <p className="empty-state">{noDataLabel}</p>
        ) : (
          <>
            <div className="metric-grid">
              <MetricItem title={workoutsLabel} value={String(progressSummary.workoutSessionsCount)} />
              <MetricItem title={minutesLabel} value={String(progressSummary.totalTrainingMinutes)} />
              <MetricItem title={setsLabel} value={String(progressSummary.totalCompletedSets)} />
              <MetricItem title={nutritionLabel} value={String(progressSummary.nutritionLogsCount)} />
              <MetricItem title={avgCaloriesLabel} value={String(progressSummary.averageCalories)} />
              <MetricItem title={avgProteinLabel} value={String(progressSummary.averageProteinGrams)} />
            </div>
            <p className="section-subtitle">{filtersLabel}</p>
            <div className="inline-inputs">
              <input
                aria-label={minSessionsPlaceholder}
                placeholder={minSessionsPlaceholder}
                value={minSessionsValue}
                onChange={(event) => onMinSessionsChange(event.target.value)}
              />
              <label className="compact-label">
                {sortLabel}
                <select
                  aria-label={sortLabel}
                  value={sortMode}
                  onChange={(event) => onSortModeChange(event.target.value as ProgressSortMode)}
                >
                  <option value="date_desc">{sortByDateLabel}</option>
                  <option value="sessions_desc">{sortBySessionsLabel}</option>
                  <option value="minutes_desc">{sortByMinutesLabel}</option>
                </select>
              </label>
              <button className="button ghost" onClick={onClearFilters} type="button">
                {clearFiltersLabel}
              </button>
            </div>
            <p className="history-item-head">
              <span>{filteredHistoryLabel}</span>
              <strong>{filteredHistoryValue}</strong>
            </p>
            <div className="history-list">
              {filteredHistory.length === 0 ? (
                <p className="empty-state">{noFilteredHistoryLabel}</p>
              ) : (
                filteredHistory.map((entry) => (
                  <article key={entry.date} className="history-item">
                    <strong>{entry.date}</strong>
                    <div className="history-values">
                      <span>{historySessionsLabel} {entry.workoutSessions}</span>
                      <span>{historyMinutesLabel} {entry.trainingMinutes}</span>
                      <span>{historySetsLabel} {entry.completedSets}</span>
                      <span>{historyCaloriesLabel} {entry.calories ?? "-"}</span>
                      <span>{effortLabel} {entry.effortScore}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </article>
  );
});
