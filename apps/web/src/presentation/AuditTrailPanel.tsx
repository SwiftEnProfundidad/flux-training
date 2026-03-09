import { memo } from "react";
import type {
  AuditCategoryFilter,
  AuditSeverityFilter,
  AuditSourceFilter,
  AuditTimelineRow
} from "./audit-compliance";

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

type AuditTrailPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  loadTimelineLabel: string;
  loadTimelineActionId: string;
  onLoadTimeline: () => void;
  exportCsvLabel: string;
  exportCsvActionId: string;
  onExportCsv: () => void;
  exportForensicLabel: string;
  exportForensicActionId: string;
  onExportForensic: () => void;
  clearFiltersLabel: string;
  clearFiltersActionId: string;
  onClearFilters: () => void;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  domainPlaceholder: string;
  domainValue: string;
  onDomainChange: (value: string) => void;
  sourceFilterLabel: string;
  sourceFilterValue: AuditSourceFilter;
  sourceOptions: FilterOption<AuditSourceFilter>[];
  onSourceFilterChange: (value: AuditSourceFilter) => void;
  categoryFilterLabel: string;
  categoryFilterValue: AuditCategoryFilter;
  categoryOptions: FilterOption<AuditCategoryFilter>[];
  onCategoryFilterChange: (value: AuditCategoryFilter) => void;
  severityFilterLabel: string;
  severityFilterValue: AuditSeverityFilter;
  severityOptions: FilterOption<AuditSeverityFilter>[];
  onSeverityFilterChange: (value: AuditSeverityFilter) => void;
  rowsLoadedLabel: string;
  rowsLoadedValue: string;
  rowsFilteredLabel: string;
  rowsFilteredValue: string;
  structuredLogsLabel: string;
  structuredLogsValue: string;
  activityLogLabel: string;
  activityLogValue: string;
  forensicStatusLabel: string;
  forensicStatusValue: string;
  emptyLabel: string;
  rowsInfoLabel: string;
  rows: AuditTimelineRow[];
  occurredAtLabel: string;
  sourceLabel: string;
  categoryLabel: string;
  severityLabel: string;
  nameLabel: string;
  domainLabel: string;
  correlationLabel: string;
  summaryLabel: string;
  severityHumanizer: (value: string) => string;
  severityClassName: (severity: AuditTimelineRow["severity"]) => string;
  hasMoreRows: boolean;
  loadMoreRowsLabel: string;
  onLoadMoreRows: () => void;
  showAllRowsLabel: string;
  onShowAllRows: () => void;
};

export const AuditTrailPanel = memo(function AuditTrailPanel({
  screenId,
  routeId,
  statusId,
  title,
  loadTimelineLabel,
  loadTimelineActionId,
  onLoadTimeline,
  exportCsvLabel,
  exportCsvActionId,
  onExportCsv,
  exportForensicLabel,
  exportForensicActionId,
  onExportForensic,
  clearFiltersLabel,
  clearFiltersActionId,
  onClearFilters,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  domainPlaceholder,
  domainValue,
  onDomainChange,
  sourceFilterLabel,
  sourceFilterValue,
  sourceOptions,
  onSourceFilterChange,
  categoryFilterLabel,
  categoryFilterValue,
  categoryOptions,
  onCategoryFilterChange,
  severityFilterLabel,
  severityFilterValue,
  severityOptions,
  onSeverityFilterChange,
  rowsLoadedLabel,
  rowsLoadedValue,
  rowsFilteredLabel,
  rowsFilteredValue,
  structuredLogsLabel,
  structuredLogsValue,
  activityLogLabel,
  activityLogValue,
  forensicStatusLabel,
  forensicStatusValue,
  emptyLabel,
  rowsInfoLabel,
  rows,
  occurredAtLabel,
  sourceLabel,
  categoryLabel,
  severityLabel,
  nameLabel,
  domainLabel,
  correlationLabel,
  summaryLabel,
  severityHumanizer,
  severityClassName,
  hasMoreRows,
  loadMoreRowsLabel,
  onLoadMoreRows,
  showAllRowsLabel,
  onShowAllRows
}: AuditTrailPanelProps) {
  return (
    <div className="form-grid" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      <div className="inline-inputs">
        <button
          className="button ghost"
          data-action-id={loadTimelineActionId}
          onClick={onLoadTimeline}
          type="button"
        >
          {loadTimelineLabel}
        </button>
        <button
          className="button primary"
          data-action-id={exportCsvActionId}
          onClick={onExportCsv}
          type="button"
        >
          {exportCsvLabel}
        </button>
        <button
          className="button ghost"
          data-action-id={exportForensicActionId}
          onClick={onExportForensic}
          type="button"
        >
          {exportForensicLabel}
        </button>
        <button
          className="button ghost"
          data-action-id={clearFiltersActionId}
          onClick={onClearFilters}
          type="button"
        >
          {clearFiltersLabel}
        </button>
      </div>
      <div className="inline-inputs">
        <input
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <input
          aria-label={domainPlaceholder}
          placeholder={domainPlaceholder}
          value={domainValue}
          onChange={(event) => onDomainChange(event.target.value)}
        />
      </div>
      <div className="inline-inputs">
        <label className="compact-label">
          {sourceFilterLabel}
          <select
            aria-label={sourceFilterLabel}
            value={sourceFilterValue}
            onChange={(event) => onSourceFilterChange(event.target.value as AuditSourceFilter)}
          >
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="compact-label">
          {categoryFilterLabel}
          <select
            aria-label={categoryFilterLabel}
            value={categoryFilterValue}
            onChange={(event) => onCategoryFilterChange(event.target.value as AuditCategoryFilter)}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="compact-label">
          {severityFilterLabel}
          <select
            aria-label={severityFilterLabel}
            value={severityFilterValue}
            onChange={(event) => onSeverityFilterChange(event.target.value as AuditSeverityFilter)}
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="stat-line"><span>{rowsLoadedLabel}</span><strong>{rowsLoadedValue}</strong></p>
      <p className="stat-line"><span>{rowsFilteredLabel}</span><strong>{rowsFilteredValue}</strong></p>
      <p className="stat-line"><span>{structuredLogsLabel}</span><strong>{structuredLogsValue}</strong></p>
      <p className="stat-line"><span>{activityLogLabel}</span><strong>{activityLogValue}</strong></p>
      <p className="stat-line"><span>{forensicStatusLabel}</span><strong>{forensicStatusValue}</strong></p>
      {rows.length === 0 ? (
        <p className="empty-state">{emptyLabel}</p>
      ) : (
        <>
          <p className="dense-table-info">{rowsInfoLabel}</p>
          <div className="operations-table">
            <header className="operations-table-row operations-table-header">
              <span>{occurredAtLabel}</span>
              <span>{sourceLabel}</span>
              <span>{categoryLabel}</span>
              <span>{severityLabel}</span>
              <span>{nameLabel}</span>
              <span>{domainLabel}</span>
              <span>{correlationLabel}</span>
              <span>{summaryLabel}</span>
            </header>
            {rows.map((row) => (
              <div key={row.id} className="operations-table-row audit-table-row">
                <span>{row.occurredAt}</span>
                <span>{row.source}</span>
                <span>{row.category}</span>
                <span className={`status-pill status-${severityClassName(row.severity)}`}>
                  {severityHumanizer(row.severity)}
                </span>
                <span>{row.name}</span>
                <span>{row.domain}</span>
                <span>{row.correlationId}</span>
                <span>{row.summary}</span>
              </div>
            ))}
          </div>
          {hasMoreRows ? (
            <div className="dense-table-actions">
              <button className="button ghost" onClick={onLoadMoreRows} type="button">
                {loadMoreRowsLabel}
              </button>
              <button className="button ghost" onClick={onShowAllRows} type="button">
                {showAllRowsLabel}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
});
