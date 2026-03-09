import { memo } from "react";

type ShortcutsCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  showQATools: boolean;
  visibleModulesLabel: string;
  visibleModulesValue: string;
  roleLabel: string;
  roleValue: string;
  domainLabel: string;
  domainValue: string;
  queueLabel: string;
  queueValue: string;
  runActionId: string;
  runLabel: string;
  onRun: () => void;
  refreshActionId: string;
  refreshLabel: string;
  onRefresh: () => void;
  recoverActionId: string;
  recoverLabel: string;
  onRecover: () => void;
  emptyLabel: string;
  modules: string[];
};

export const ShortcutsCard = memo(function ShortcutsCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  showQATools,
  visibleModulesLabel,
  visibleModulesValue,
  roleLabel,
  roleValue,
  domainLabel,
  domainValue,
  queueLabel,
  queueValue,
  runActionId,
  runLabel,
  onRun,
  refreshActionId,
  refreshLabel,
  onRefresh,
  recoverActionId,
  recoverLabel,
  onRecover,
  emptyLabel,
  modules
}: ShortcutsCardProps) {
  return (
    <article
      className="module-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id="web.shortcuts.status"
    >
      <header className="module-header">
        <h2>{title}</h2>
        <p>
          {statusLabel}: <span className={`status-pill status-${statusClass}`}>{statusValue}</span>
        </p>
      </header>
      <div className="form-grid">
        <p className="runtime-state-copy">{summary}</p>
        {showQATools ? (
          <div className="inline-inputs">
            <article className="metric-item">
              <p>{visibleModulesLabel}</p>
              <strong>{visibleModulesValue}</strong>
            </article>
            <article className="metric-item">
              <p>{roleLabel}</p>
              <strong>{roleValue}</strong>
            </article>
            <article className="metric-item">
              <p>{domainLabel}</p>
              <strong>{domainValue}</strong>
            </article>
            <article className="metric-item">
              <p>{queueLabel}</p>
              <strong>{queueValue}</strong>
            </article>
          </div>
        ) : null}
        <div className="inline-inputs">
          <button className="button primary" type="button" data-action-id={runActionId} onClick={onRun}>
            {runLabel}
          </button>
          <button className="button ghost" type="button" data-action-id={refreshActionId} onClick={onRefresh}>
            {refreshLabel}
          </button>
          {showQATools ? (
            <button className="button ghost" type="button" data-action-id={recoverActionId} onClick={onRecover}>
              {recoverLabel}
            </button>
          ) : null}
        </div>
        {showQATools && modules.length === 0 ? (
          <p className="empty-state">{emptyLabel}</p>
        ) : showQATools ? (
          <div className="inline-inputs">
            {modules.slice(0, 8).map((moduleId) => (
              <span key={`shortcut-${moduleId}`} className="chip role-badge">
                {moduleId}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
});
