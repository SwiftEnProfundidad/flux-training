import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AIInsightsPanel } from "./AIInsightsPanel";

describe("AIInsightsPanel", () => {
  it("renders empty ai state and actions", () => {
    const markup = renderToStaticMarkup(
      <AIInsightsPanel
        screenId="web.aiInsights.screen"
        routeId="web.route.aiInsights"
        statusId="web.aiInsights.status"
        title="Insights IA"
        summary="Panel operativo de recomendaciones."
        loadActionLabel="Cargar insights IA"
        loadActionId="web.aiInsights.loadRecommendations"
        onLoadRecommendations={vi.fn()}
        refreshActionLabel="Refrescar senales IA"
        refreshActionId="web.aiInsights.refreshSignals"
        onRefreshSignals={vi.fn()}
        refreshDisabled={false}
        recommendationsMetricLabel="Recomendaciones"
        recommendationsMetricValue="0"
        highPriorityMetricLabel="Prioridad alta"
        highPriorityMetricValue="0"
        signalsMetricLabel="Senales operativas"
        signalsMetricValue="0"
        emptyLabel="No hay insights IA disponibles con los datos actuales."
        recommendations={[]}
        priorityClassName={() => "neutral"}
      />
    );

    expect(markup).toContain("Panel operativo de recomendaciones.");
    expect(markup).toContain("No hay insights IA disponibles con los datos actuales.");
    expect(markup).toContain("web.aiInsights.loadRecommendations");
    expect(markup).toContain("web.aiInsights.refreshSignals");
  });

  it("renders recommendations and priority pill", () => {
    const markup = renderToStaticMarkup(
      <AIInsightsPanel
        screenId="web.aiInsights.screen"
        routeId="web.route.aiInsights"
        statusId="web.aiInsights.status"
        title="Insights IA"
        summary="Panel operativo de recomendaciones."
        loadActionLabel="Cargar insights IA"
        loadActionId="web.aiInsights.loadRecommendations"
        onLoadRecommendations={vi.fn()}
        refreshActionLabel="Refrescar senales IA"
        refreshActionId="web.aiInsights.refreshSignals"
        onRefreshSignals={vi.fn()}
        refreshDisabled={false}
        recommendationsMetricLabel="Recomendaciones"
        recommendationsMetricValue="1"
        highPriorityMetricLabel="Prioridad alta"
        highPriorityMetricValue="1"
        signalsMetricLabel="Senales operativas"
        signalsMetricValue="4"
        emptyLabel="No hay insights IA disponibles con los datos actuales."
        recommendations={[
          {
            id: "rec-1",
            userId: "demo-user",
            title: "Revisar adherencia",
            rationale: "La cohorte muestra perdida de continuidad.",
            category: "training",
            expectedImpact: "retention",
            actionLabel: "Abrir plan",
            priority: "high",
            generatedAt: "2026-03-06T18:00:00.000Z"
          }
        ]}
        priorityClassName={() => "warning"}
      />
    );

    expect(markup).toContain("Revisar adherencia");
    expect(markup).toContain("La cohorte muestra perdida de continuidad.");
    expect(markup).toContain("Abrir plan");
    expect(markup).toContain("status-pill status-warning");
  });
});
