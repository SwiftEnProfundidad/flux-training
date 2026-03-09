import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NutritionLogDetailPanel } from "./NutritionLogDetailPanel";

describe("NutritionLogDetailPanel", () => {
  it("renders empty state and actions", () => {
    const markup = renderToStaticMarkup(
      <NutritionLogDetailPanel
        screenId="web.light.logDetail.screen"
        routeId="web.route.light.logDetail"
        statusId="web.light.logDetail.status"
        title="Detalle de log"
        summary="Resumen detalle"
        loadLabel="Refrescar detalle"
        loadActionId="web.light.logDetail.loadDetail"
        onLoad={vi.fn()}
        loadDisabled={false}
        clearLabel="Limpiar seleccion"
        clearActionId="web.light.logDetail.clearSelection"
        onClearSelection={vi.fn()}
        openCoachLabel="Abrir vista coach"
        openCoachActionId="web.light.logDetail.openCoachView"
        onOpenCoachView={vi.fn()}
        selectLabel="seleccionar log"
        selectActionId="web.light.logDetail.selectLog"
        selectedOptionKey=""
        onSelectLog={vi.fn()}
        optionRows={[]}
        selectedDateLabel="fecha"
        selectedDateValue="-"
        selectedAthleteLabel="atleta"
        selectedAthleteValue="-"
        noSelectionLabel="No hay seleccion"
        selectedLog={null}
        caloriesLabel="calorias"
        proteinLabel="proteina g"
        carbsLabel="carbohidratos g"
        fatsLabel="grasas g"
      />
    );

    expect(markup).toContain("Detalle de log");
    expect(markup).toContain("No hay seleccion");
    expect(markup).toContain("web.light.logDetail.loadDetail");
    expect(markup).toContain("web.light.logDetail.clearSelection");
    expect(markup).toContain("web.light.logDetail.openCoachView");
  });

  it("renders selected log detail and selectable rows", () => {
    const log = {
      userId: "demo-user",
      date: "2026-02-26",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    };

    const markup = renderToStaticMarkup(
      <NutritionLogDetailPanel
        screenId="web.light.logDetail.screen"
        routeId="web.route.light.logDetail"
        statusId="web.light.logDetail.status"
        title="Detalle de log"
        summary="Resumen detalle"
        loadLabel="Refrescar detalle"
        loadActionId="web.light.logDetail.loadDetail"
        onLoad={vi.fn()}
        loadDisabled={false}
        clearLabel="Limpiar seleccion"
        clearActionId="web.light.logDetail.clearSelection"
        onClearSelection={vi.fn()}
        openCoachLabel="Abrir vista coach"
        openCoachActionId="web.light.logDetail.openCoachView"
        onOpenCoachView={vi.fn()}
        selectLabel="seleccionar log"
        selectActionId="web.light.logDetail.selectLog"
        selectedOptionKey="demo-user-2026-02-26-0"
        onSelectLog={vi.fn()}
        optionRows={[{ key: "demo-user-2026-02-26-0", log }]}
        selectedDateLabel="fecha"
        selectedDateValue="2026-02-26"
        selectedAthleteLabel="atleta"
        selectedAthleteValue="demo-user"
        noSelectionLabel="No hay seleccion"
        selectedLog={log}
        caloriesLabel="calorias"
        proteinLabel="proteina g"
        carbsLabel="carbohidratos g"
        fatsLabel="grasas g"
      />
    );

    expect(markup).toContain("2026-02-26");
    expect(markup).toContain("demo-user");
    expect(markup).toContain("calorias 2200");
    expect(markup).toContain("proteina g 150");
    expect(markup).toContain("carbohidratos g 230");
    expect(markup).toContain("grasas g 70");
    expect(markup).toContain("web.light.logDetail.selectLog");
  });
});
