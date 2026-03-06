import { memo } from "react";

type AlertSeverity = "high" | "medium";
type AlertReason = "calories" | "protein";

type DeviationAlert = {
  id: string;
  date: string;
  severity: AlertSeverity;
  reason: AlertReason;
  calories: number;
  proteinGrams: number;
};

type DeviationAlertsPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  summary: string;
  loadActionLabel: string;
  loadActionId: string;
  onLoadAlerts: () => void;
  loadDisabled: boolean;
  clearActionLabel: string;
  clearActionId: string;
  onClearFilters: () => void;
  highRiskLabel: string;
  highRiskValue: string;
  moderateRiskLabel: string;
  moderateRiskValue: string;
  noDataLabel: string;
  alerts: DeviationAlert[];
  caloriesLabel: string;
  proteinLabel: string;
  reasonCaloriesLabel: string;
  reasonProteinLabel: string;
  highSeverityLabel: string;
  moderateSeverityLabel: string;
  severityClassName: (severity: AlertSeverity) => string;
};

type StatLineProps = {
  label: string;
  value: string;
};

function StatLine({ label, value }: StatLineProps) {
  return (
    <p className="history-item-head">
      <span>{label}</span>
      <strong>{value}</strong>
    </p>
  );
}

export const DeviationAlertsPanel = memo(function DeviationAlertsPanel({
  screenId,
  routeId,
  statusId,
  title,
  summary,
  loadActionLabel,
  loadActionId,
  onLoadAlerts,
  loadDisabled,
  clearActionLabel,
  clearActionId,
  onClearFilters,
  highRiskLabel,
  highRiskValue,
  moderateRiskLabel,
  moderateRiskValue,
  noDataLabel,
  alerts,
  caloriesLabel,
  proteinLabel,
  reasonCaloriesLabel,
  reasonProteinLabel,
  highSeverityLabel,
  moderateSeverityLabel,
  severityClassName
}: DeviationAlertsPanelProps) {
  return (
    <div className="history-list" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      <p className="runtime-state-copy">{summary}</p>
      <div className="inline-inputs">
        <button
          className="button primary"
          onClick={onLoadAlerts}
          type="button"
          data-action-id={loadActionId}
          disabled={loadDisabled}
        >
          {loadActionLabel}
        </button>
        <button
          className="button ghost"
          onClick={onClearFilters}
          type="button"
          data-action-id={clearActionId}
        >
          {clearActionLabel}
        </button>
      </div>
      <StatLine label={highRiskLabel} value={highRiskValue} />
      <StatLine label={moderateRiskLabel} value={moderateRiskValue} />
      {alerts.length === 0 ? (
        <p className="empty-state">{noDataLabel}</p>
      ) : (
        <div className="history-list">
          {alerts.map((alert) => (
            <article key={alert.id} className="history-item">
              <div className="history-item-head">
                <strong>{alert.date}</strong>
                <span className={`status-pill status-${severityClassName(alert.severity)}`}>
                  {alert.severity === "high" ? highSeverityLabel : moderateSeverityLabel}
                </span>
              </div>
              <p className="runtime-state-copy">
                {alert.reason === "calories" ? reasonCaloriesLabel : reasonProteinLabel}
              </p>
              <div className="history-values">
                <span>{caloriesLabel} {alert.calories}</span>
                <span>{proteinLabel} {alert.proteinGrams}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
});
