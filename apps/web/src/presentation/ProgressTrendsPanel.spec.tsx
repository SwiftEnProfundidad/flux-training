import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProgressTrendsPanel } from "./ProgressTrendsPanel";

describe("ProgressTrendsPanel", () => {
  it("renders empty state with refresh action", () => {
    const markup = renderToStaticMarkup(
      <ProgressTrendsPanel
        screenId="web.progressTrends.screen"
        routeId="web.route.progressTrends"
        statusId="web.progressTrends.status"
        title="Progreso"
        status="empty"
        statusLabel="Progreso"
        summary="Resumen de progreso"
        refreshLabel="Cargar progreso"
        refreshActionId="web.progressTrends.refresh"
        onRefresh={vi.fn()}
        refreshDisabled={false}
        progressSummary={null}
        noDataLabel="Sin datos de progreso"
        workoutsLabel="sesiones"
        minutesLabel="minutos"
        setsLabel="series"
        nutritionLabel="nutricion"
        avgCaloriesLabel="kcal media"
        avgProteinLabel="proteina media"
        filtersLabel="Filtros"
        minSessionsPlaceholder="minimo de sesiones"
        minSessionsValue=""
        onMinSessionsChange={vi.fn()}
        sortLabel="orden"
        sortMode="date_desc"
        onSortModeChange={vi.fn()}
        sortByDateLabel="fecha"
        sortBySessionsLabel="sesiones"
        sortByMinutesLabel="minutos"
        clearFiltersLabel="Limpiar filtros"
        onClearFilters={vi.fn()}
        filteredHistoryLabel="Historial filtrado"
        filteredHistoryValue="0"
        filteredHistory={[]}
        noFilteredHistoryLabel="Sin historial filtrado"
        historySessionsLabel="sesiones"
        historyMinutesLabel="minutos"
        historySetsLabel="series"
        historyCaloriesLabel="kcal"
        effortLabel="esfuerzo"
      />
    );

    expect(markup).toContain("Progreso");
    expect(markup).toContain("Sin datos de progreso");
    expect(markup).toContain("web.progressTrends.refresh");
  });

  it("renders metrics and filtered history rows", () => {
    const markup = renderToStaticMarkup(
      <ProgressTrendsPanel
        screenId="web.progressTrends.screen"
        routeId="web.route.progressTrends"
        statusId="web.progressTrends.status"
        title="Progreso"
        status="success"
        statusLabel="Progreso"
        summary="Resumen de progreso"
        refreshLabel="Cargar progreso"
        refreshActionId="web.progressTrends.refresh"
        onRefresh={vi.fn()}
        refreshDisabled={false}
        progressSummary={{
          userId: "demo-user",
          generatedAt: "2026-03-06T20:00:00.000Z",
          workoutSessionsCount: 4,
          totalTrainingMinutes: 210,
          totalCompletedSets: 18,
          nutritionLogsCount: 4,
          averageCalories: 2425,
          averageProteinGrams: 138,
          averageCarbsGrams: 220,
          averageFatsGrams: 68,
          history: []
        }}
        noDataLabel="Sin datos de progreso"
        workoutsLabel="sesiones"
        minutesLabel="minutos"
        setsLabel="series"
        nutritionLabel="nutricion"
        avgCaloriesLabel="kcal media"
        avgProteinLabel="proteina media"
        filtersLabel="Filtros"
        minSessionsPlaceholder="minimo de sesiones"
        minSessionsValue="2"
        onMinSessionsChange={vi.fn()}
        sortLabel="orden"
        sortMode="minutes_desc"
        onSortModeChange={vi.fn()}
        sortByDateLabel="fecha"
        sortBySessionsLabel="sesiones"
        sortByMinutesLabel="minutos"
        clearFiltersLabel="Limpiar filtros"
        onClearFilters={vi.fn()}
        filteredHistoryLabel="Historial filtrado"
        filteredHistoryValue="1"
        filteredHistory={[
          {
            date: "2026-02-26",
            workoutSessions: 2,
            trainingMinutes: 75,
            completedSets: 8,
            calories: 2200,
            effortScore: 7
          }
        ]}
        noFilteredHistoryLabel="Sin historial filtrado"
        historySessionsLabel="sesiones"
        historyMinutesLabel="minutos"
        historySetsLabel="series"
        historyCaloriesLabel="kcal"
        effortLabel="esfuerzo"
      />
    );

    expect(markup).toContain("2425");
    expect(markup).toContain("138");
    expect(markup).toContain("2026-02-26");
    expect(markup).toContain("sesiones 2");
    expect(markup).toContain("minutos 75");
    expect(markup).toContain("series 8");
    expect(markup).toContain("kcal 2200");
    expect(markup).toContain("esfuerzo 7");
  });
});
