import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProductOverviewPanel } from "./ProductOverviewPanel";

describe("ProductOverviewPanel", () => {
  it("renders kpis, bars and alerts for the authenticated shell", () => {
    const onViewAllAlerts = vi.fn();

    const markup = renderToStaticMarkup(
      <ProductOverviewPanel
        title="Panel principal"
        summary="Resumen semanal del equipo."
        metrics={[
          {
            id: "athletes",
            label: "Atletas activos",
            value: "47",
            detail: "Onboarding: success",
            tone: "positive"
          },
          {
            id: "plans",
            label: "Planes activos",
            value: "12",
            detail: "Planes: 12",
            tone: "neutral"
          }
        ]}
        bars={[
          { id: "onboarding", label: "Onboarding", value: "84%", height: 84, tone: "positive" },
          { id: "training", label: "Training", value: "61%", height: 61, tone: "neutral" }
        ]}
        alertsTitle="Alertas recientes"
        alerts={[
          {
            id: "alert-1",
            title: "Dolor de rodilla",
            meta: "Carlos M. · hoy 09:14",
            tone: "critical"
          }
        ]}
        emptyAlertsLabel="No hay alertas."
        viewAllAlertsLabel="Ver todas las alertas"
        onViewAllAlerts={onViewAllAlerts}
      />
    );

    expect(markup).toContain("Panel principal");
    expect(markup).toContain("Atletas activos");
    expect(markup).toContain("47");
    expect(markup).toContain("Onboarding");
    expect(markup).toContain("Alertas recientes");
    expect(markup).toContain("Dolor de rodilla");
    expect(markup).toContain("Ver todas las alertas");
  });
});
