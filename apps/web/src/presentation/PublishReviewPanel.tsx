import { memo } from "react";

type PublishChecklistItem = {
  id: string;
  label: string;
  valid: boolean;
};

type PublishReviewPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  statusLabel: string;
  statusClass: string;
  statusValue: string;
  showStatus: boolean;
  summary: string;
  previewLabel: string;
  previewActionId: string;
  onPreview: () => void;
  checklistLabel: string;
  checklistActionId: string;
  onRunChecklist: () => void;
  publishLabel: string;
  publishActionId: string;
  onPublish: () => void;
  publishDisabled: boolean;
  clearLabel: string;
  clearActionId: string;
  onClear: () => void;
  checklistItems: PublishChecklistItem[];
  checklistOkLabel: string;
  checklistPendingLabel: string;
  planMetricLabel: string;
  planMetricValue: string;
  checklistMetricLabel: string;
  checklistMetricValue: string;
  resultMetricLabel: string;
  resultMetricValue: string;
  noResultLabel: string;
  publishedPrefix: string;
  publishedId: string | null;
};

export const PublishReviewPanel = memo(function PublishReviewPanel({
  screenId,
  routeId,
  statusId,
  title,
  statusLabel,
  statusClass,
  statusValue,
  showStatus,
  summary,
  previewLabel,
  previewActionId,
  onPreview,
  checklistLabel,
  checklistActionId,
  onRunChecklist,
  publishLabel,
  publishActionId,
  onPublish,
  publishDisabled,
  clearLabel,
  clearActionId,
  onClear,
  checklistItems,
  checklistOkLabel,
  checklistPendingLabel,
  planMetricLabel,
  planMetricValue,
  checklistMetricLabel,
  checklistMetricValue,
  resultMetricLabel,
  resultMetricValue,
  noResultLabel,
  publishedPrefix,
  publishedId
}: PublishReviewPanelProps) {
  return (
    <div className="history-list" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <header className="module-header">
        <h2>{title}</h2>
        {showStatus ? (
          <p>
            {statusLabel}: <span className={`status-pill status-${statusClass}`}>{statusValue}</span>
          </p>
        ) : null}
      </header>
      <p>{summary}</p>
      <div className="inline-inputs">
        <button className="button ghost" onClick={onPreview} type="button" data-action-id={previewActionId}>
          {previewLabel}
        </button>
        <button
          className="button ghost"
          onClick={onRunChecklist}
          type="button"
          data-action-id={checklistActionId}
        >
          {checklistLabel}
        </button>
        <button
          className="button primary"
          onClick={onPublish}
          type="button"
          data-action-id={publishActionId}
          disabled={publishDisabled}
        >
          {publishLabel}
        </button>
        <button className="button ghost" onClick={onClear} type="button" data-action-id={clearActionId}>
          {clearLabel}
        </button>
      </div>
      <div className="choice-list">
        {checklistItems.map((item) => (
          <label key={item.id}>
            <span>{item.label}</span>
            <span>{item.valid ? checklistOkLabel : checklistPendingLabel}</span>
          </label>
        ))}
      </div>
      <div className="inline-inputs">
        <article className="metric-item">
          <p>{planMetricLabel}</p>
          <strong>{planMetricValue}</strong>
        </article>
        <article className="metric-item">
          <p>{checklistMetricLabel}</p>
          <strong>{checklistMetricValue}</strong>
        </article>
        <article className="metric-item">
          <p>{resultMetricLabel}</p>
          <strong>{resultMetricValue}</strong>
        </article>
      </div>
      {publishedId === null ? (
        <p className="empty-state">{noResultLabel}</p>
      ) : (
        <p className="section-subtitle">
          {publishedPrefix} {publishedId}
        </p>
      )}
    </div>
  );
});
