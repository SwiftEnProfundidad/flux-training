import { memo } from "react";

type SessionOption = {
  key: string;
  label: string;
};

type SessionSummary = {
  planId: string;
  startedAt: string;
  endedAt: string;
  durationLabel: string;
  exerciseCount: string;
};

type SessionDetailPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  summary: string;
  selectLabel: string;
  selectedKey: string;
  selectActionId: string;
  onSelectKey: (value: string) => void;
  options: SessionOption[];
  clearLabel: string;
  clearActionId: string;
  onClear: () => void;
  openVideoLabel: string;
  openVideoActionId: string;
  onOpenVideo: () => void;
  openVideoDisabled: boolean;
  noSelectionLabel: string;
  selectedSession: SessionSummary | null;
  planLabel: string;
  startedLabel: string;
  endedLabel: string;
  durationLabel: string;
  exerciseCountLabel: string;
};

export const SessionDetailPanel = memo(function SessionDetailPanel({
  screenId,
  routeId,
  statusId,
  title,
  summary,
  selectLabel,
  selectedKey,
  selectActionId,
  onSelectKey,
  options,
  clearLabel,
  clearActionId,
  onClear,
  openVideoLabel,
  openVideoActionId,
  onOpenVideo,
  openVideoDisabled,
  noSelectionLabel,
  selectedSession,
  planLabel,
  startedLabel,
  endedLabel,
  durationLabel,
  exerciseCountLabel
}: SessionDetailPanelProps) {
  return (
    <div className="history-list" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      <p>{summary}</p>
      <div className="inline-inputs">
        <select
          aria-label={selectLabel}
          value={selectedKey}
          data-action-id={selectActionId}
          onChange={(event) => onSelectKey(event.target.value)}
        >
          <option value="">{selectLabel}</option>
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className="button ghost"
          onClick={onClear}
          type="button"
          data-action-id={clearActionId}
        >
          {clearLabel}
        </button>
        <button
          className="button ghost"
          onClick={onOpenVideo}
          type="button"
          data-action-id={openVideoActionId}
          disabled={openVideoDisabled}
        >
          {openVideoLabel}
        </button>
      </div>
      {selectedSession === null ? (
        <p className="empty-state">{noSelectionLabel}</p>
      ) : (
        <div className="metric-grid">
          <article className="metric-item">
            <p>{planLabel}</p>
            <strong>{selectedSession.planId}</strong>
          </article>
          <article className="metric-item">
            <p>{startedLabel}</p>
            <strong>{selectedSession.startedAt}</strong>
          </article>
          <article className="metric-item">
            <p>{endedLabel}</p>
            <strong>{selectedSession.endedAt}</strong>
          </article>
          <article className="metric-item">
            <p>{durationLabel}</p>
            <strong>{selectedSession.durationLabel}</strong>
          </article>
          <article className="metric-item">
            <p>{exerciseCountLabel}</p>
            <strong>{selectedSession.exerciseCount}</strong>
          </article>
        </div>
      )}
    </div>
  );
});
