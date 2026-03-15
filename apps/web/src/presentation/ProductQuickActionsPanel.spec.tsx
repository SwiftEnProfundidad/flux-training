import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProductQuickActionsPanel } from "./ProductQuickActionsPanel";

describe("ProductQuickActionsPanel", () => {
  it("renders a quick actions grid for the product shell", () => {
    const markup = renderToStaticMarkup(
      <ProductQuickActionsPanel
        screenId="web.quickActions.screen"
        routeId="web.route.dashboardHome"
        status="success"
        title="¿Qué quieres hacer hoy?"
        actions={[
          {
            id: "add-athlete",
            icon: "✦",
            title: "Añadir atleta",
            meta: "Crear perfil rápido",
            tone: "positive",
            onPress: vi.fn()
          },
          {
            id: "review-alerts",
            icon: "△",
            title: "Revisar alertas",
            meta: "2 siguen abiertas",
            tone: "critical",
            onPress: vi.fn()
          }
        ]}
      />
    );

    expect(markup).toContain("¿Qué quieres hacer hoy?");
    expect(markup).toContain("data-screen-id=\"web.quickActions.screen\"");
    expect(markup).toContain("data-route-id=\"web.route.dashboardHome\"");
    expect(markup).toContain("data-screen-state=\"success\"");
    expect(markup).toContain("Añadir atleta");
    expect(markup).toContain("Revisar alertas");
    expect(markup).toContain("2 siguen abiertas");
  });
});
