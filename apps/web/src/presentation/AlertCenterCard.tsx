import { memo } from "react";

type AlertCenterRow = {
  id: string;
  occurredAt: string;
  severity: string;
  summary: string;
};

type AlertCenterCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  openCountLabel: string;
  openCountValue: string;
  highSeverityLabel: string;
  highSeverityValue: string;
  runbooksLabel: string;
  runbooksValue: string;
  loadActionId: string;
  loadLabel: string;
  onLoad: () => void;
  auditActionId: string;
  auditLabel: string;
  onAudit: () => void;
  noAlertsLabel: string;
  occurredAtLabel: string;
  severityLabel: string;
  summaryLabel: string;
  rows: AlertCenterRow[];
};

export const AlertCenterCard = memo(function AlertCenterCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  openCountLabel,
  openCountValue,
  highSeverityLabel,
  highSeverityValue,
  runbooksLabel,
  runbooksValue,
  loadActionId,
  loadLabel,
  onLoad,
  auditActionId,
  auditLabel,
  onAudit,
  noAlertsLabel,
  occurredAtLabel,
  severityLabel,
  summaryLabel,
  rows
}: AlertCenterCardProps) {
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
            <p>{highSeverityLabel}</p>
            <strong>{highSeverityValue}</strong>
          </article>
          <article className="metric-item">
            <p>{runbooksLabel}</p>
            <strong>{runbooksValue}</strong>
          </article>
        </div>
        <div className="inline-inputs">
          <button className="button primary" type="button" data-action-id={loadActionId} onClick={onLoad}>
            {loadLabel}
          </button>
          <button className="button ghost" type="button" data-action-id={auditActionId} onClick={onAudit}>
            {auditLabel}
          </button>
        </div>
        {rows.length === 0 ? (
          <p className="empty-state">{noAlertsLabel}</p>
        ) : (
          <div className="dense-table">
            <table>
              <thead>
                <tr>
                  <th>{occurredAtLabel}</th>
                  <th>{severityLabel}</th>
                  <th>{summaryLabel}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.occurredAt}</td>
                    <td>{row.severity}</td>
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
