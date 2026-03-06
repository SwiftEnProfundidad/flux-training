import { memo } from "react";

type CoachNoteRow = {
  id: string;
  occurredAt: string;
  source: string;
  outcome: string;
  summary: string;
};

type CoachNotesPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  loadNotesLabel: string;
  loadNotesActionId: string;
  onLoadNotes: () => void;
  saveFollowUpLabel: string;
  saveFollowUpActionId: string;
  onSaveFollowUp: () => void;
  clearSelectionLabel: string;
  clearSelectionActionId: string;
  onClearSelection: () => void;
  hasSelection: boolean;
  hasRows: boolean;
  emptyLabel: string;
  noRowsLabel: string;
  occurredAtLabel: string;
  sourceLabel: string;
  outcomeLabel: string;
  summaryLabel: string;
  rows: CoachNoteRow[];
};

export const CoachNotesPanel = memo(function CoachNotesPanel({
  screenId,
  routeId,
  statusId,
  title,
  loadNotesLabel,
  loadNotesActionId,
  onLoadNotes,
  saveFollowUpLabel,
  saveFollowUpActionId,
  onSaveFollowUp,
  clearSelectionLabel,
  clearSelectionActionId,
  onClearSelection,
  hasSelection,
  hasRows,
  emptyLabel,
  noRowsLabel,
  occurredAtLabel,
  sourceLabel,
  outcomeLabel,
  summaryLabel,
  rows
}: CoachNotesPanelProps) {
  return (
    <div className="history-list" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      <div className="inline-inputs">
        <button
          className="button primary"
          data-action-id={loadNotesActionId}
          onClick={onLoadNotes}
          type="button"
        >
          {loadNotesLabel}
        </button>
        <button
          className="button ghost"
          data-action-id={saveFollowUpActionId}
          onClick={onSaveFollowUp}
          type="button"
        >
          {saveFollowUpLabel}
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
      {!hasSelection ? (
        <p className="empty-state">{emptyLabel}</p>
      ) : !hasRows ? (
        <p className="empty-state">{noRowsLabel}</p>
      ) : (
        rows.map((note) => (
          <article key={note.id} className="history-item">
            <strong>{note.occurredAt}</strong>
            <div className="history-values">
              <span>
                {occurredAtLabel} {note.occurredAt}
              </span>
              <span>
                {sourceLabel} {note.source}
              </span>
              <span>
                {outcomeLabel} {note.outcome}
              </span>
              <span>
                {summaryLabel} {note.summary}
              </span>
            </div>
          </article>
        ))
      )}
    </div>
  );
});
