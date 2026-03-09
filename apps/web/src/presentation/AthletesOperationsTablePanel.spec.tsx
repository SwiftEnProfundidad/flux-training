import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AthletesOperationsTablePanel } from "./AthletesOperationsTablePanel";
import type { AthleteOperationsRow } from "./core-operations";

const sampleRows: AthleteOperationsRow[] = [
  {
    athleteId: "athlete-01",
    plansCount: 2,
    sessionsCount: 5,
    nutritionLogsCount: 4,
    lastSessionDate: "2026-03-01",
    riskLevel: "normal"
  },
  {
    athleteId: "athlete-02",
    plansCount: 1,
    sessionsCount: 0,
    nutritionLogsCount: 0,
    lastSessionDate: "-",
    riskLevel: "attention"
  }
];

describe("AthletesOperationsTablePanel", () => {
  it("renders empty state when there are no athlete rows", () => {
    const markup = renderToStaticMarkup(
      <AthletesOperationsTablePanel
        screenId="web.athletesList.screen"
        routeId="web.route.athletesList"
        statusId="web.athletesList.status"
        rows={[]}
        selectedAthleteIds={new Set()}
        onToggleAthleteSelection={vi.fn()}
        athleteColumnLabel="Atleta"
        plansColumnLabel="Planes"
        sessionsColumnLabel="Sesiones"
        nutritionColumnLabel="Nutricion"
        lastSessionColumnLabel="Ultima sesion"
        riskColumnLabel="Riesgo"
        riskNormalLabel="Normal"
        riskAttentionLabel="Atencion"
        emptyLabel="No hay atletas"
        rowsInfoLabel="Filas visibles 0/0"
        hasMoreRows={false}
        loadMoreRowsLabel="Cargar mas"
        loadMoreRowsActionId="web.athletesList.showMoreRows"
        onLoadMoreRows={vi.fn()}
        showAllRowsLabel="Mostrar todo"
        showAllRowsActionId="web.athletesList.showAllRows"
        onShowAllRows={vi.fn()}
      />
    );

    expect(markup).toContain("No hay atletas");
    expect(markup).not.toContain("Filas visibles");
  });

  it("renders athlete rows, status labels and dense table actions", () => {
    const markup = renderToStaticMarkup(
      <AthletesOperationsTablePanel
        screenId="web.athletesList.screen"
        routeId="web.route.athletesList"
        statusId="web.athletesList.status"
        rows={sampleRows}
        selectedAthleteIds={new Set(["athlete-01"])}
        onToggleAthleteSelection={vi.fn()}
        athleteColumnLabel="Atleta"
        plansColumnLabel="Planes"
        sessionsColumnLabel="Sesiones"
        nutritionColumnLabel="Nutricion"
        lastSessionColumnLabel="Ultima sesion"
        riskColumnLabel="Riesgo"
        riskNormalLabel="Normal"
        riskAttentionLabel="Atencion"
        emptyLabel="No hay atletas"
        rowsInfoLabel="Filas visibles 2/10"
        hasMoreRows={true}
        loadMoreRowsLabel="Cargar mas"
        loadMoreRowsActionId="web.athletesList.showMoreRows"
        onLoadMoreRows={vi.fn()}
        showAllRowsLabel="Mostrar todo"
        showAllRowsActionId="web.athletesList.showAllRows"
        onShowAllRows={vi.fn()}
      />
    );

    expect(markup).toContain("Filas visibles 2/10");
    expect(markup).toContain("athlete-01");
    expect(markup).toContain("athlete-02");
    expect(markup).toContain("Normal");
    expect(markup).toContain("Atencion");
    expect(markup).toContain("web.athletesList.showMoreRows");
    expect(markup).toContain("web.athletesList.showAllRows");
    expect(markup).toContain("checked");
  });
});
