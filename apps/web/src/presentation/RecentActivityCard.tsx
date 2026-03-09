import { memo } from "react";

type RecentActivityRow = {
  id: string;
  occurredAt: string;
  action: string;
  domain: string;
  outcome: string;
  summary: string;
};

type RecentActivityCardProps = {
  screenId: string;
  routeId: string;
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  summary: string;
  activityLabel: string;
  activityValue: string;
  deniedLabel: string;
  deniedValue: string;
  errorLabel: string;
  errorValue: string;
  lastOccurredLabel: string;
  lastOccurredValue: string;
  refreshActionId: string;
  refreshLabel: string;
  onRefresh: () => void;
  emptyLabel: string;
  occurredAtLabel: string;
  nameLabel: string;
  domainLabel: string;
  outcomeLabel: string;
  summaryLabel: string;
  rows: RecentActivityRow[];
};

export const RecentActivityCard = memo(function RecentActivityCard({
  screenId,
  routeId,
  title,
  statusLabel,
  statusValue,
  statusClass,
  summary,
  activityLabel,
  activityValue,
  deniedLabel,
  deniedValue,
  errorLabel,
  errorValue,
  lastOccurredLabel,
  lastOccurredValue,
  refreshActionId,
  refreshLabel,
  onRefresh,
  emptyLabel,
  occurredAtLabel,
  nameLabel,
  domainLabel,
  outcomeLabel,
  summaryLabel,
  rows
}: RecentActivityCardProps) {
  return (
    <article
      className="module-card"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-status-id="web.recentActivity.status"
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
            <p>{activityLabel}</p>
            <strong>{activityValue}</strong>
          </article>
          <article className="metric-item">
            <p>{deniedLabel}</p>
            <strong>{deniedValue}</strong>
          </article>
          <article className="metric-item">
            <p>{errorLabel}</p>
            <strong>{errorValue}</strong>
          </article>
          <article className="metric-item">
            <p>{lastOccurredLabel}</p>
            <strong>{lastOccurredValue}</strong>
          </article>
        </div>
        <button className="button ghost" type="button" data-action-id={refreshActionId} onClick={onRefresh}>
          {refreshLabel}
        </button>
        {rows.length === 0 ? (
          <p className="empty-state">{emptyLabel}</p>
        ) : (
          <div className="dense-table">
            <table>
              <thead>
                <tr>
                  <th>{occurredAtLabel}</th>
                  <th>{nameLabel}</th>
                  <th>{domainLabel}</th>
                  <th>{outcomeLabel}</th>
                  <th>{summaryLabel}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.occurredAt}</td>
                    <td>{entry.action}</td>
                    <td>{entry.domain}</td>
                    <td>{entry.outcome}</td>
                    <td>{entry.summary}</td>
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
