import { memo } from "react";

type AlertsFullRow = {
  id: string;
  occurredAt: string;
  severity: string;
  code: string;
  runbook: string;
  summary: string;
};

type AlertsFullCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  openCountLabel: string;
  openCountValue: string;
  runbooksLabel: string;
  runbooksValue: string;
  activityLabel: string;
  activityValue: string;
  highSeverityLabel: string;
  highSeverityValue: string;
  refreshActionId: string;
  refreshLabel: string;
  onRefresh: () => void;
  auditActionId: string;
  auditLabel: string;
  onAudit: () => void;
  emptyLabel: string;
  occurredAtLabel: string;
  severityLabel: string;
  codeLabel: string;
  runbookLabel: string;
  summaryLabel: string;
  rows: AlertsFullRow[];
};

export const AlertsFullCard = memo(function AlertsFullCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  openCountLabel,
  openCountValue,
  runbooksLabel,
  runbooksValue,
  activityLabel,
  activityValue,
  highSeverityLabel,
  highSeverityValue,
  refreshActionId,
  refreshLabel,
  onRefresh,
  auditActionId,
  auditLabel,
  onAudit,
  emptyLabel,
  occurredAtLabel,
  severityLabel,
  codeLabel,
  runbookLabel,
  summaryLabel,
  rows
}: AlertsFullCardProps) {
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
            <p>{openCountLabel}</p>
            <strong>{openCountValue}</strong>
          </article>
          <article className="metric-item">
            <p>{runbooksLabel}</p>
            <strong>{runbooksValue}</strong>
          </article>
          <article className="metric-item">
            <p>{activityLabel}</p>
            <strong>{activityValue}</strong>
          </article>
          <article className="metric-item">
            <p>{highSeverityLabel}</p>
            <strong>{highSeverityValue}</strong>
          </article>
        </div>
        <div className="inline-inputs">
          <button className="button primary" type="button" data-action-id={refreshActionId} onClick={onRefresh}>
            {refreshLabel}
          </button>
          <button className="button ghost" type="button" data-action-id={auditActionId} onClick={onAudit}>
            {auditLabel}
          </button>
        </div>
        {rows.length === 0 ? (
          <p className="empty-state">{emptyLabel}</p>
        ) : (
          <div className="dense-table">
            <table>
              <thead>
                <tr>
                  <th>{occurredAtLabel}</th>
                  <th>{severityLabel}</th>
                  <th>{codeLabel}</th>
                  <th>{runbookLabel}</th>
                  <th>{summaryLabel}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.occurredAt}</td>
                    <td>{row.severity}</td>
                    <td>{row.code}</td>
                    <td>{row.runbook}</td>
                    <td>{row.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
});
