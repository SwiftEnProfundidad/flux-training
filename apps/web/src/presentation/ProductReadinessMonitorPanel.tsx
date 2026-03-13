import { memo } from "react";

type ProductReadinessAthleteTone = "positive" | "neutral" | "critical";
type ProductReadinessTrendTone = "positive" | "critical";

type ProductReadinessAthleteItem = {
  id: string;
  initials: string;
  name: string;
  score: number;
  tone: ProductReadinessAthleteTone;
};

type ProductReadinessTrendBar = {
  id: string;
  label: string;
  score: number;
  tone: ProductReadinessTrendTone;
};

type ProductReadinessMonitorPanelProps = {
  screenId: string;
  routeId: string;
  status: string;
  athletesTitle: string;
  athletes: readonly ProductReadinessAthleteItem[];
  viewAllLabel: string;
  onViewAll: () => void;
  trendTitle: string;
  trendLegendLabel: string;
  trendCriticalLegendLabel: string;
  trendBars: readonly ProductReadinessTrendBar[];
  insight: string;
};

export const ProductReadinessMonitorPanel = memo(function ProductReadinessMonitorPanel({
  screenId,
  routeId,
  status,
  athletesTitle,
  athletes,
  viewAllLabel,
  onViewAll,
  trendTitle,
  trendLegendLabel,
  trendCriticalLegendLabel,
  trendBars,
  insight
}: ProductReadinessMonitorPanelProps) {
  return (
    <section
      className="product-readiness-shell"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-screen-state={status}
    >
      <article className="product-readiness-athletes-card">
        <header className="product-readiness-card-header">
          <h2>{athletesTitle}</h2>
        </header>
        <div className="product-readiness-athletes-list">
          {athletes.map((athlete) => (
            <article key={athlete.id} className={`product-readiness-athlete-row tone-${athlete.tone}`}>
              <span className="product-readiness-athlete-avatar" aria-hidden="true">
                {athlete.initials}
              </span>
              <strong>{athlete.name}</strong>
              <span className="product-readiness-athlete-score">
                {athlete.score}
                {athlete.tone === "critical" ? " △" : ""}
              </span>
            </article>
          ))}
        </div>
        <button className="button ghost product-readiness-view-all" type="button" onClick={onViewAll}>
          {viewAllLabel}
        </button>
      </article>
      <article className="product-readiness-trend-card">
        <header className="product-readiness-card-header">
          <div className="product-readiness-trend-copy">
            <h2>{trendTitle}</h2>
            <div className="product-readiness-trend-legend">
              <span className="product-readiness-legend-item">
                <span className="product-readiness-legend-dot positive" aria-hidden="true" />
                {trendLegendLabel}
              </span>
              <span className="product-readiness-legend-item">
                <span className="product-readiness-legend-dot critical" aria-hidden="true" />
                {trendCriticalLegendLabel}
              </span>
            </div>
          </div>
        </header>
        <div className="product-readiness-trend-chart" aria-label={trendTitle}>
          {trendBars.map((bar) => (
            <article key={bar.id} className={`product-readiness-trend-bar tone-${bar.tone}`} title={bar.label}>
              <span
                className="product-readiness-trend-fill"
                style={{ height: `${Math.max(22, Math.min(bar.score, 100))}%` }}
              />
            </article>
          ))}
        </div>
        <footer className="product-readiness-insight">
          <span aria-hidden="true">◌</span>
          <strong>{insight}</strong>
        </footer>
      </article>
    </section>
  );
});
