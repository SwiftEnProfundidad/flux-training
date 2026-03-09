import { memo } from "react";

type OfflineSyncPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  status: string;
  statusLabel: string;
  summary: string;
  syncLabel: string;
  syncActionId: string;
  onSync: () => void;
  refreshLabel: string;
  refreshActionId: string;
  onRefresh: () => void;
  pendingActionsLabel: string;
  pendingActionsValue: string;
  rejectedLastSyncLabel: string;
  rejectedLastSyncValue: string;
  idempotencyKeyLabel: string;
  idempotencyKeyValue: string;
  idempotencyReplayLabel: string;
  idempotencyReplayValue: string;
  idempotencyTtlLabel: string;
  idempotencyTtlValue: string;
};

type StatLineProps = {
  label: string;
  value: string;
};

function StatLine({ label, value }: StatLineProps) {
  return (
    <p className="stat-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </p>
  );
}

export const OfflineSyncPanel = memo(function OfflineSyncPanel({
  screenId,
  routeId,
  statusId,
  title,
  status,
  statusLabel,
  summary,
  syncLabel,
  syncActionId,
  onSync,
  refreshLabel,
  refreshActionId,
  onRefresh,
  pendingActionsLabel,
  pendingActionsValue,
  rejectedLastSyncLabel,
  rejectedLastSyncValue,
  idempotencyKeyLabel,
  idempotencyKeyValue,
  idempotencyReplayLabel,
  idempotencyReplayValue,
  idempotencyTtlLabel,
  idempotencyTtlValue
}: OfflineSyncPanelProps) {
  return (
    <article
      className="module-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id={statusId}
    >
      <header className="module-header">
        <h2>{title}</h2>
        <p>
          {statusLabel}: <span className="status-pill">{status}</span>
        </p>
      </header>
      <div className="form-grid">
        {summary.length > 0 ? <p className="runtime-state-copy">{summary}</p> : null}
        <div className="inline-inputs">
          <button
            className="button primary"
            onClick={onSync}
            type="button"
            data-action-id={syncActionId}
          >
            {syncLabel}
          </button>
          <button
            className="button ghost"
            onClick={onRefresh}
            type="button"
            data-action-id={refreshActionId}
          >
            {refreshLabel}
          </button>
        </div>
        <StatLine label={pendingActionsLabel} value={pendingActionsValue} />
        <StatLine label={rejectedLastSyncLabel} value={rejectedLastSyncValue} />
        <StatLine label={idempotencyKeyLabel} value={idempotencyKeyValue} />
        <StatLine label={idempotencyReplayLabel} value={idempotencyReplayValue} />
        <StatLine label={idempotencyTtlLabel} value={idempotencyTtlValue} />
      </div>
    </article>
  );
});
