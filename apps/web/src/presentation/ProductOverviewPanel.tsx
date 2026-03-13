import { memo } from "react";

type ProductOverviewTone = "neutral" | "positive" | "critical";

type ProductOverviewMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: ProductOverviewTone;
};

type ProductOverviewBar = {
  id: string;
  label: string;
  value: string;
  height: number;
  tone: ProductOverviewTone;
};

type ProductOverviewAlert = {
  id: string;
  title: string;
  meta: string;
  tone: ProductOverviewTone;
};

type ProductOverviewPanelProps = {
  title: string;
  summary: string;
  metrics: ProductOverviewMetric[];
  bars: ProductOverviewBar[];
  alertsTitle: string;
  alerts: ProductOverviewAlert[];
  emptyAlertsLabel: string;
  viewAllAlertsLabel: string;
  onViewAllAlerts: () => void;
};

export const ProductOverviewPanel = memo(function ProductOverviewPanel({
  title,
  summary,
  metrics,
  bars,
  alertsTitle,
  alerts,
  emptyAlertsLabel,
  viewAllAlertsLabel,
  onViewAllAlerts
}: ProductOverviewPanelProps) {
  return (
    <section className="product-overview-shell">
      <div className="product-kpi-row">
        {metrics.map((metric) => (
          <article key={metric.id} className={`product-kpi-card tone-${metric.tone}`}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
          </article>
        ))}
      </div>
      <div className="product-overview-grid">
        <article className="product-overview-card">
          <header className="product-overview-header">
            <div>
              <h2>{title}</h2>
              <p>{summary}</p>
            </div>
            <div className="product-overview-periods" aria-hidden="true">
              <span className="active">7D</span>
              <span>30D</span>
              <span>90D</span>
            </div>
          </header>
          <div className="product-overview-chart">
            {bars.map((bar) => (
              <article key={bar.id} className={`product-overview-bar tone-${bar.tone}`}>
                <div className="product-overview-bar-track">
                  <span
                    className="product-overview-bar-fill"
                    style={{ height: `${Math.max(16, Math.min(bar.height, 100))}%` }}
                  />
                </div>
                <strong>{bar.value}</strong>
                <span>{bar.label}</span>
              </article>
            ))}
          </div>
        </article>
        <aside className="product-alerts-card">
          <header className="product-alerts-header">
            <h2>{alertsTitle}</h2>
          </header>
          {alerts.length === 0 ? (
            <p className="empty-state">{emptyAlertsLabel}</p>
          ) : (
            <div className="product-alerts-list">
              {alerts.map((alert) => (
                <article key={alert.id} className={`product-alert-card tone-${alert.tone}`}>
                  <strong>{alert.title}</strong>
                  <span>{alert.meta}</span>
                </article>
              ))}
            </div>
          )}
          <button className="button ghost product-alerts-action" type="button" onClick={onViewAllAlerts}>
            {viewAllAlertsLabel}
          </button>
        </aside>
      </div>
    </section>
  );
});
