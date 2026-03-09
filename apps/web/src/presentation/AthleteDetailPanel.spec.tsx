import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AthleteDetailPanel } from "./AthleteDetailPanel";

describe("AthleteDetailPanel", () => {
  it("renders empty state and primary actions when no athlete is selected", () => {
    const markup = renderToStaticMarkup(
      <AthleteDetailPanel
        screenId="web.athleteDetail.screen"
        routeId="web.route.athleteDetail"
        statusId="web.athleteDetail.status"
        title="Detalle de atleta"
        emptyLabel="Selecciona un atleta"
        selectedRow={null}
        plansLabel="Planes"
        sessionsLabel="Sesiones"
        nutritionLabel="Nutricion"
        lastSessionLabel="Ultima sesion"
        riskNormalLabel="Normal"
        riskAttentionLabel="Atencion"
        selectFirstAthleteLabel="Seleccionar primer atleta"
        selectFirstAthleteActionId="web.athleteDetail.selectFirstAthlete"
        onSelectFirstAthlete={vi.fn()}
        openSessionHistoryLabel="Abrir historial"
        openSessionHistoryActionId="web.athleteDetail.openSessionHistory"
        onOpenSessionHistory={vi.fn()}
        clearSelectionLabel="Limpiar seleccion"
        clearSelectionActionId="web.athleteDetail.clearSelection"
        onClearSelection={vi.fn()}
      />
    );

    expect(markup).toContain("Detalle de atleta");
    expect(markup).toContain("Selecciona un atleta");
    expect(markup).toContain("web.athleteDetail.selectFirstAthlete");
    expect(markup).toContain("web.athleteDetail.openSessionHistory");
    expect(markup).toContain("web.athleteDetail.clearSelection");
  });

  it("renders selected athlete metrics and attention state", () => {
    const markup = renderToStaticMarkup(
      <AthleteDetailPanel
        screenId="web.athleteDetail.screen"
        routeId="web.route.athleteDetail"
        statusId="web.athleteDetail.status"
        title="Detalle de atleta"
        emptyLabel="Selecciona un atleta"
        selectedRow={{
          athleteId: "demo-user",
          plansCount: 2,
          sessionsCount: 5,
          nutritionLogsCount: 3,
          lastSessionDate: "2026-03-06",
          riskLevel: "attention"
        }}
        plansLabel="Planes"
        sessionsLabel="Sesiones"
        nutritionLabel="Nutricion"
        lastSessionLabel="Ultima sesion"
        riskNormalLabel="Normal"
        riskAttentionLabel="Atencion"
        selectFirstAthleteLabel="Seleccionar primer atleta"
        selectFirstAthleteActionId="web.athleteDetail.selectFirstAthlete"
        onSelectFirstAthlete={vi.fn()}
        openSessionHistoryLabel="Abrir historial"
        openSessionHistoryActionId="web.athleteDetail.openSessionHistory"
        onOpenSessionHistory={vi.fn()}
        clearSelectionLabel="Limpiar seleccion"
        clearSelectionActionId="web.athleteDetail.clearSelection"
        onClearSelection={vi.fn()}
      />
    );

    expect(markup).toContain("demo-user");
    expect(markup).toContain("Planes 2");
    expect(markup).toContain("Sesiones 5");
    expect(markup).toContain("Nutricion 3");
    expect(markup).toContain("Ultima sesion 2026-03-06");
    expect(markup).toContain("status-pill status-critical");
    expect(markup).toContain("Atencion");
  });
});
