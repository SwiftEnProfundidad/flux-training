import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DeviationAlertsPanel } from "./DeviationAlertsPanel";

describe("DeviationAlertsPanel", () => {
  it("renders empty state", () => {
    const markup = renderToStaticMarkup(
      <DeviationAlertsPanel
        screenId="web.deviationAlerts.screen"
        routeId="web.route.deviationAlerts"
        statusId="web.deviationAlerts.status"
        title="Alertas de desvio"
        summary="Detecta desvio calorico/proteico."
        loadActionLabel="Evaluar desvios"
        loadActionId="web.deviationAlerts.loadAlerts"
        onLoadAlerts={vi.fn()}
        loadDisabled={false}
        clearActionLabel="Reiniciar filtros"
        clearActionId="web.deviationAlerts.clearFilters"
        onClearFilters={vi.fn()}
        highRiskLabel="Riesgo alto"
        highRiskValue="0"
        moderateRiskLabel="Riesgo moderado"
        moderateRiskValue="0"
        noDataLabel="No hay desvios"
        alerts={[]}
        caloriesLabel="calorias"
        proteinLabel="proteina"
        reasonCaloriesLabel="Desvio calorico"
        reasonProteinLabel="Desvio proteico"
        highSeverityLabel="Riesgo alto"
        moderateSeverityLabel="Riesgo moderado"
        severityClassName={(severity) => severity}
      />
    );

    expect(markup).toContain("data-screen-id=\"web.deviationAlerts.screen\"");
    expect(markup).toContain("Alertas de desvio");
    expect(markup).toContain("Evaluar desvios");
    expect(markup).toContain("Reiniciar filtros");
    expect(markup).toContain("No hay desvios");
  });

  it("renders alert rows", () => {
    const markup = renderToStaticMarkup(
      <DeviationAlertsPanel
        screenId="web.deviationAlerts.screen"
        routeId="web.route.deviationAlerts"
        statusId="web.deviationAlerts.status"
        title="Alertas de desvio"
        summary="Detecta desvio calorico/proteico."
        loadActionLabel="Evaluar desvios"
        loadActionId="web.deviationAlerts.loadAlerts"
        onLoadAlerts={vi.fn()}
        loadDisabled={false}
        clearActionLabel="Reiniciar filtros"
        clearActionId="web.deviationAlerts.clearFilters"
        onClearFilters={vi.fn()}
        highRiskLabel="Riesgo alto"
        highRiskValue="1"
        moderateRiskLabel="Riesgo moderado"
        moderateRiskValue="0"
        noDataLabel="No hay desvios"
        alerts={[
          {
            id: "alert-1",
            date: "2026-02-26",
            severity: "high",
            reason: "calories",
            calories: 3100,
            proteinGrams: 120
          }
        ]}
        caloriesLabel="calorias"
        proteinLabel="proteina"
        reasonCaloriesLabel="Desvio calorico"
        reasonProteinLabel="Desvio proteico"
        highSeverityLabel="Riesgo alto"
        moderateSeverityLabel="Riesgo moderado"
        severityClassName={(severity) => severity}
      />
    );

    expect(markup).toContain("2026-02-26");
    expect(markup).toContain("Desvio calorico");
    expect(markup).toContain("calorias 3100");
    expect(markup).toContain("proteina 120");
  });
});
