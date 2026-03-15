import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductSystemStatusPanel } from "./ProductSystemStatusPanel";

describe("ProductSystemStatusPanel", () => {
  it("renders system status cards and recent system events", () => {
    const markup = renderToStaticMarkup(
      <ProductSystemStatusPanel
        screenId="web.systemStatus.screen"
        routeId="web.route.dashboardHome"
        status="success"
        cards={[
          {
            id: "runtime",
            label: "Runtime",
            status: "Operativo",
            detail: "dominio estable",
            tone: "positive"
          },
          {
            id: "queue",
            label: "Cola pendiente",
            status: "Degradado",
            detail: "1 operación pendiente",
            tone: "warning"
          }
        ]}
        eventsTitle="Eventos recientes del sistema"
        events={[
          {
            id: "evt-1",
            occurredAt: "08:25",
            summary: "Permisos · operativo"
          },
          {
            id: "evt-2",
            occurredAt: "08:18",
            summary: "Sincronización offline · 1 operación pendiente"
          }
        ]}
      />
    );

    expect(markup).toContain("data-screen-id=\"web.systemStatus.screen\"");
    expect(markup).toContain("Operativo");
    expect(markup).toContain("Degradado");
    expect(markup).toContain("Eventos recientes del sistema");
  });
});
