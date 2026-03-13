import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProductDashboardKpisPanel } from "./ProductDashboardKpisPanel";

describe("ProductDashboardKpisPanel", () => {
  it("renders compact KPI cards and the insight strip", () => {
    const onInsightPress = vi.fn();

    const markup = renderToStaticMarkup(
      <ProductDashboardKpisPanel
        screenId="web.dashboardKpis.screen"
        routeId="web.route.dashboardKpis"
        status="success"
        cards={[
          {
            id: "athletes",
            label: "Atletas activos",
            value: "4",
            detail: "3 en ritmo · 1 en seguimiento",
            tone: "positive",
            meterValue: 75,
            meterVariant: "segments"
          },
          {
            id: "alerts",
            label: "Alertas activas",
            value: "3",
            detail: "1 coach · 2 nutrición",
            tone: "critical"
          }
        ]}
        insightSummary="Pico de fatiga detectado en 2 atletas"
        insightActionLabel="Ver análisis IA →"
        onInsightPress={onInsightPress}
      />
    );

    expect(markup).toContain("data-screen-id=\"web.dashboardKpis.screen\"");
    expect(markup).toContain("Atletas activos");
    expect(markup).toContain("Alertas activas");
    expect(markup).toContain("Ver análisis IA →");
  });
});
