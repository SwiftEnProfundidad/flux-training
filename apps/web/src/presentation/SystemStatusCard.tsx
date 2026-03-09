import { memo } from "react";

type SystemStatusCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  runtimeLabel: string;
  runtimeValue: string;
  releaseLabel: string;
  releaseValue: string;
  roleMatrixLabel: string;
  roleMatrixValue: string;
  queueLabel: string;
  queueValue: string;
  syncQueueActionId: string;
  syncQueueLabel: string;
  onSyncQueue: () => void;
  recoverDomainActionId: string;
  recoverDomainLabel: string;
  onRecoverDomain: () => void;
  reloadCapabilitiesActionId: string;
  reloadCapabilitiesLabel: string;
  onReloadCapabilities: () => void;
};

export const SystemStatusCard = memo(function SystemStatusCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  runtimeLabel,
  runtimeValue,
  releaseLabel,
  releaseValue,
  roleMatrixLabel,
  roleMatrixValue,
  queueLabel,
  queueValue,
  syncQueueActionId,
  syncQueueLabel,
  onSyncQueue,
  recoverDomainActionId,
  recoverDomainLabel,
  onRecoverDomain,
  reloadCapabilitiesActionId,
  reloadCapabilitiesLabel,
  onReloadCapabilities
}: SystemStatusCardProps) {
  return (
    <article
      className="module-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id={`${screenId}.status`}
    >
      <header className="module-header">
        <h2>{title}</h2>
        <p>
          {statusLabel}: <span className={`status-pill status-${statusClass}`}>{statusValue}</span>
        </p>
      </header>
      <div className="form-grid">
        <p className="runtime-state-copy">{summary}</p>
        <div className="inline-inputs">
          <article className="metric-item">
            <p>{runtimeLabel}</p>
            <strong>{runtimeValue}</strong>
          </article>
          <article className="metric-item">
            <p>{releaseLabel}</p>
            <strong>{releaseValue}</strong>
          </article>
          <article className="metric-item">
            <p>{roleMatrixLabel}</p>
            <strong>{roleMatrixValue}</strong>
          </article>
          <article className="metric-item">
            <p>{queueLabel}</p>
            <strong>{queueValue}</strong>
          </article>
        </div>
        <div className="inline-inputs">
          <button className="button primary" type="button" data-action-id={syncQueueActionId} onClick={onSyncQueue}>
            {syncQueueLabel}
          </button>
          <button className="button ghost" type="button" data-action-id={recoverDomainActionId} onClick={onRecoverDomain}>
            {recoverDomainLabel}
          </button>
          <button
            className="button ghost"
            type="button"
            data-action-id={reloadCapabilitiesActionId}
            onClick={onReloadCapabilities}
          >
            {reloadCapabilitiesLabel}
          </button>
        </div>
      </div>
    </article>
  );
});
