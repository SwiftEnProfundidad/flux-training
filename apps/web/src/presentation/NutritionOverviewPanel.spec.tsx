import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NutritionOverviewPanel } from "./NutritionOverviewPanel";

describe("NutritionOverviewPanel", () => {
  it("renders nutrition form inputs and actions", () => {
    const markup = renderToStaticMarkup(
      <NutritionOverviewPanel
        screenId="web.nutritionOverview.screen"
        routeId="web.route.nutritionOverview"
        statusId="web.nutritionOverview.status"
        title="Nutricion"
        datePlaceholder="fecha"
        nutritionDate="2026-03-06"
        onNutritionDateChange={vi.fn()}
        caloriesPlaceholder="calorias"
        calories="2200"
        onCaloriesChange={vi.fn()}
        proteinPlaceholder="proteina"
        proteinGrams="160"
        onProteinChange={vi.fn()}
        carbsPlaceholder="carbohidratos"
        carbsGrams="230"
        onCarbsChange={vi.fn()}
        fatsPlaceholder="grasas"
        fatsGrams="70"
        onFatsChange={vi.fn()}
        saveLabel="Guardar"
        saveActionId="web.nutritionOverview.saveLog"
        onSave={vi.fn()}
        loadLabel="Cargar"
        loadActionId="web.nutritionOverview.loadLogs"
        onLoad={vi.fn()}
      />
    );

    expect(markup).toContain("data-screen-id=\"web.nutritionOverview.screen\"");
    expect(markup).toContain("Nutricion");
    expect(markup).toContain("placeholder=\"fecha\"");
    expect(markup).toContain("placeholder=\"calorias\"");
    expect(markup).toContain("placeholder=\"proteina\"");
    expect(markup).toContain("placeholder=\"carbohidratos\"");
    expect(markup).toContain("placeholder=\"grasas\"");
    expect(markup).toContain("Guardar");
    expect(markup).toContain("Cargar");
  });
});
