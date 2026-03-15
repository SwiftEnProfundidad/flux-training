import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProductAlertCenterPanel } from "./ProductAlertCenterPanel";

describe("ProductAlertCenterPanel", () => {
  it("renders a productized alert center with runtime tracing", () => {
    const markup = renderToStaticMarkup(
      <ProductAlertCenterPanel
        screenId="web.alertCenter.screen"
        routeId="web.route.dashboardHome"
        status="success"
        items={[
          {
            id: "alert-progress",
            title: "Pablo M. · progreso bajo esta semana",
            meta: "08:12 · Priorizar atletas con backlog alto · SLA 15m",
            tone: "critical",
            actionLabel: "Abrir progreso →",
            onPress: vi.fn()
          },
          {
            id: "alert-nutrition",
            title: "Laura R. · faltan logs nutricionales",
            meta: "07:44 · Resolver desvíos de nutrición prioritarios · SLA 20m",
            tone: "warning",
            actionLabel: "Abrir nutrición →",
            onPress: vi.fn()
          }
        ]}
        emptyLabel="Sin alertas activas ahora"
        footerTitle="Runbooks listos para actuar"
        footerMeta="2 flujos activos · 2 seguimientos recientes"
      />
    );

    expect(markup).toContain("data-screen-id=\"web.alertCenter.screen\"");
    expect(markup).toContain("Pablo M. · progreso bajo esta semana");
    expect(markup).toContain("Abrir nutrición →");
    expect(markup).toContain("Runbooks listos para actuar");
  });
});
