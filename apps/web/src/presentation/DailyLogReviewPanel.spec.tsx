import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DailyLogReviewPanel } from "./DailyLogReviewPanel";

describe("DailyLogReviewPanel", () => {
  it("renders filters, sort and counters", () => {
    const markup = renderToStaticMarkup(
      <DailyLogReviewPanel
        screenId="web.dailyLogReview.screen"
        routeId="web.route.dailyLogReview"
        statusId="web.dailyLogReview.status"
        title="Filtros de nutricion"
        dateFilterPlaceholder="filtrar por fecha"
        dateFilterValue="2026-02-26"
        onDateFilterChange={vi.fn()}
        minProteinPlaceholder="proteina minima"
        minProteinValue="120"
        onMinProteinChange={vi.fn()}
        maxCaloriesPlaceholder="calorias maximas"
        maxCaloriesValue="2400"
        onMaxCaloriesChange={vi.fn()}
        sortLabel="orden nutricion"
        sortValue="date_desc"
        sortOptions={[
          { value: "date_desc", label: "fecha" },
          { value: "calories_desc", label: "calorias" }
        ]}
        onSortChange={vi.fn()}
        clearFiltersLabel="Limpiar filtros nutricion"
        clearFiltersActionId="web.dailyLogReview.clearFilters"
        onClearFilters={vi.fn()}
        updateFiltersActionId="web.dailyLogReview.updateFilters"
        updateSortActionId="web.dailyLogReview.updateSort"
        logsLoadedLabel="Registros cargados"
        logsLoadedValue="4"
        filteredLogsLabel="Registros filtrados"
        filteredLogsValue="2"
      />
    );

    expect(markup).toContain("data-screen-id=\"web.dailyLogReview.screen\"");
    expect(markup).toContain("Filtros de nutricion");
    expect(markup).toContain("placeholder=\"filtrar por fecha\"");
    expect(markup).toContain("placeholder=\"proteina minima\"");
    expect(markup).toContain("placeholder=\"calorias maximas\"");
    expect(markup).toContain("orden nutricion");
    expect(markup).toContain("Limpiar filtros nutricion");
    expect(markup).toContain("Registros cargados");
    expect(markup).toContain(">4<");
    expect(markup).toContain("Registros filtrados");
    expect(markup).toContain(">2<");
  });
});
