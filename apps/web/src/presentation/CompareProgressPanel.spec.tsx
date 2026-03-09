import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CompareProgressPanel } from "./CompareProgressPanel";

describe("CompareProgressPanel", () => {
  it("renders empty state and actions when no athlete is selected", () => {
    const markup = renderToStaticMarkup(
      <CompareProgressPanel
        screenId="web.compareProgress.screen"
        routeId="web.route.compareProgress"
        statusId="web.compareProgress.status"
        title="Comparar progreso"
        loadProgressLabel="Cargar progreso"
        loadProgressActionId="web.compareProgress.loadProgress"
        onLoadProgress={vi.fn()}
        selectFirstAthleteLabel="Seleccionar primer atleta"
        selectFirstAthleteActionId="web.compareProgress.selectFirstAthlete"
        onSelectFirstAthlete={vi.fn()}
        openSessionHistoryLabel="Abrir historial"
        openSessionHistoryActionId="web.compareProgress.openSessionHistory"
        onOpenSessionHistory={vi.fn()}
        emptyLabel="Selecciona un atleta"
        selectedRow={null}
        selectedSessionsLabel="sesiones atleta"
        cohortSessionsLabel="sesiones cohorte"
        deltaSessionsLabel="delta sesiones"
        selectedNutritionLabel="nutricion atleta"
        cohortNutritionLabel="nutricion cohorte"
        deltaNutritionLabel="delta nutricion"
        cohortAverageSessions={4}
        cohortAverageNutritionLogs={2}
      />
    );

    expect(markup).toContain("Comparar progreso");
    expect(markup).toContain("Selecciona un atleta");
    expect(markup).toContain("web.compareProgress.loadProgress");
    expect(markup).toContain("web.compareProgress.selectFirstAthlete");
    expect(markup).toContain("web.compareProgress.openSessionHistory");
  });

  it("renders cohort deltas for selected athlete", () => {
    const markup = renderToStaticMarkup(
      <CompareProgressPanel
        screenId="web.compareProgress.screen"
        routeId="web.route.compareProgress"
        statusId="web.compareProgress.status"
        title="Comparar progreso"
        loadProgressLabel="Cargar progreso"
        loadProgressActionId="web.compareProgress.loadProgress"
        onLoadProgress={vi.fn()}
        selectFirstAthleteLabel="Seleccionar primer atleta"
        selectFirstAthleteActionId="web.compareProgress.selectFirstAthlete"
        onSelectFirstAthlete={vi.fn()}
        openSessionHistoryLabel="Abrir historial"
        openSessionHistoryActionId="web.compareProgress.openSessionHistory"
        onOpenSessionHistory={vi.fn()}
        emptyLabel="Selecciona un atleta"
        selectedRow={{
          athleteId: "demo-user",
          plansCount: 1,
          sessionsCount: 6,
          nutritionLogsCount: 5,
          lastSessionDate: "2026-03-06",
          riskLevel: "normal"
        }}
        selectedSessionsLabel="sesiones atleta"
        cohortSessionsLabel="sesiones cohorte"
        deltaSessionsLabel="delta sesiones"
        selectedNutritionLabel="nutricion atleta"
        cohortNutritionLabel="nutricion cohorte"
        deltaNutritionLabel="delta nutricion"
        cohortAverageSessions={4.5}
        cohortAverageNutritionLogs={3}
      />
    );

    expect(markup).toContain("sesiones atleta");
    expect(markup).toContain(">6<");
    expect(markup).toContain(">4.5<");
    expect(markup).toContain(">+1.5<");
    expect(markup).toContain(">5<");
    expect(markup).toContain(">3<");
    expect(markup).toContain(">+2.0<");
  });
});
