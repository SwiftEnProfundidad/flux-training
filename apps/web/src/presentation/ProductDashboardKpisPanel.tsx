import { memo } from "react";

type ProductDashboardKpiTone = "neutral" | "positive" | "warning" | "critical";
type ProductDashboardKpiMeterVariant = "solid" | "segments";

type ProductDashboardKpiCard = {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: ProductDashboardKpiTone;
  emphasis?: boolean;
  meterValue?: number;
  meterVariant?: ProductDashboardKpiMeterVariant;
};

type ProductDashboardKpisPanelProps = {
  screenId: string;
  routeId: string;
  status: string;
  cards: readonly ProductDashboardKpiCard[];
  insightSummary: string;
  insightActionLabel: string;
  onInsightPress: () => void;
};

export const ProductDashboardKpisPanel = memo(function ProductDashboardKpisPanel({
  screenId,
  routeId,
  status,
  cards,
  insightSummary,
  insightActionLabel,
  onInsightPress
}: ProductDashboardKpisPanelProps) {
  return (
    <section
      className="product-dashboard-kpis-shell"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-screen-state={status}
    >
      <div className="product-dashboard-kpis-grid">
        {cards.map((card) => (
          <article
            key={card.id}
            className={`product-dashboard-kpi-card tone-${card.tone} ${
              card.emphasis ? "emphasis" : ""
            }`}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
            {card.meterValue !== undefined ? (
              card.meterVariant === "segments" ? (
                <div className="product-dashboard-kpi-meter segments" aria-hidden="true">
                  {Array.from({ length: 6 }, (_, index) => (
                    <span
                      key={`${card.id}-segment-${index}`}
                      className={
                        index < Math.max(1, Math.round(((card.meterValue ?? 0) / 100) * 6))
                          ? "active"
                          : ""
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="product-dashboard-kpi-meter" aria-hidden="true">
                  <span style={{ width: `${Math.max(8, Math.min(card.meterValue ?? 0, 100))}%` }} />
                </div>
              )
            ) : null}
          </article>
        ))}
      </div>
      <article className="product-dashboard-kpi-insight">
        <div className="product-dashboard-kpi-insight-copy">
          <span aria-hidden="true">◌</span>
          <strong>{insightSummary}</strong>
        </div>
        <button
          className="button product-dashboard-kpi-insight-action"
          type="button"
          onClick={onInsightPress}
        >
          {insightActionLabel}
        </button>
      </article>
    </section>
  );
});
