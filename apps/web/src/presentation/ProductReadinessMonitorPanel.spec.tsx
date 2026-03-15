import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProductReadinessMonitorPanel } from "./ProductReadinessMonitorPanel";

describe("ProductReadinessMonitorPanel", () => {
  it("renders roster, trend legend and readiness insight", () => {
    const onViewAll = vi.fn();

    const markup = renderToStaticMarkup(
      <ProductReadinessMonitorPanel
        screenId="web.readinessMonitor.screen"
        routeId="web.route.readinessMonitor"
        status="success"
        athletesTitle="Atletas — Preparación hoy"
        athletes={[
          { id: "athlete-1", initials: "CM", name: "Carlos M.", score: 81, tone: "positive" },
          { id: "athlete-2", initials: "AR", name: "Ana R.", score: 43, tone: "critical" }
        ]}
        viewAllLabel="Ver todos (2) →"
        onViewAll={onViewAll}
        trendTitle="Tendencia preparación — Últimos 14 días"
        trendLegendLabel="Equipo"
        trendCriticalLegendLabel="<50 (crítico)"
        trendBars={[
          { id: "day-1", label: "lun", score: 74, tone: "positive" },
          { id: "day-2", label: "mar", score: 44, tone: "critical" }
        ]}
        insight="IA detecta patrón: preparación baja los lunes."
      />
    );

    expect(markup).toContain("data-screen-id=\"web.readinessMonitor.screen\"");
    expect(markup).toContain("Atletas — Preparación hoy");
    expect(markup).toContain("Carlos M.");
    expect(markup).toContain("Tendencia preparación — Últimos 14 días");
    expect(markup).toContain("IA detecta patrón");
  });
});
