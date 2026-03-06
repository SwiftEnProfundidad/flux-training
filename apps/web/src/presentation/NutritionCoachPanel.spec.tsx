import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NutritionCoachPanel } from "./NutritionCoachPanel";

describe("NutritionCoachPanel", () => {
  it("renders empty coach and cohort states with actions", () => {
    const markup = renderToStaticMarkup(
      <NutritionCoachPanel
        coachScreenId="web.nutritionCoachView.screen"
        coachRouteId="web.route.nutritionCoach"
        coachStatusId="web.nutritionCoachView.status"
        coachTitle="Vista coach"
        coachSummary="Resumen coach"
        coachLoadLabel="Cargar cohorte"
        coachLoadActionId="web.nutritionCoachView.loadCohort"
        onCoachLoad={vi.fn()}
        coachLoadDisabled={false}
        coachFocusLabel="Ver en riesgo"
        coachFocusActionId="web.nutritionCoachView.focusAtRisk"
        onCoachFocusAtRisk={vi.fn()}
        coachOpenOperationsLabel="Abrir operaciones"
        coachOpenOperationsActionId="web.nutritionCoachView.openOperations"
        onCoachOpenOperations={vi.fn()}
        athletesLoadedLabel="Atletas cargados"
        athletesLoadedValue="0"
        athletesAtRiskLabel="En riesgo"
        athletesAtRiskValue="0"
        coachEmptyLabel="Sin atletas"
        coachRows={[]}
        plansLabel="planes"
        sessionsLabel="sesiones"
        nutritionLabel="nutricion"
        lastSessionLabel="ultima sesion"
        riskAttentionLabel="Atencion"
        riskNormalLabel="Normal"
        riskClassName={() => "critical"}
        showCohortView={true}
        cohortScreenId="web.light.cohortNutrition.screen"
        cohortRouteId="web.route.cohortNutrition"
        cohortStatusId="web.light.cohortNutrition.status"
        cohortTitle="Cohorte nutricional"
        cohortSummary="Resumen cohorte"
        cohortLoadLabel="Cargar cohorte secundaria"
        cohortLoadActionId="web.light.cohortNutrition.loadCohort"
        onCohortLoad={vi.fn()}
        cohortLoadDisabled={false}
        cohortFocusLabel="Foco mayor riesgo"
        cohortFocusActionId="web.light.cohortNutrition.focusHighestRisk"
        onCohortFocusHighestRisk={vi.fn()}
        cohortRows={[]}
        cohortRowsLoadedValue="0"
        cohortAtRiskValue="0"
        cohortEmptyLabel="Sin cohortes"
        cohortLogsLabel="logs"
        cohortAvgCaloriesLabel="avg kcal"
        cohortAvgProteinLabel="avg protein"
      />
    );

    expect(markup).toContain("Vista coach");
    expect(markup).toContain("Sin atletas");
    expect(markup).toContain("Cohorte nutricional");
    expect(markup).toContain("Sin cohortes");
    expect(markup).toContain("web.nutritionCoachView.loadCohort");
    expect(markup).toContain("web.light.cohortNutrition.loadCohort");
  });

  it("renders coach and cohort rows with risk pills", () => {
    const markup = renderToStaticMarkup(
      <NutritionCoachPanel
        coachScreenId="web.nutritionCoachView.screen"
        coachRouteId="web.route.nutritionCoach"
        coachStatusId="web.nutritionCoachView.status"
        coachTitle="Vista coach"
        coachSummary="Resumen coach"
        coachLoadLabel="Cargar cohorte"
        coachLoadActionId="web.nutritionCoachView.loadCohort"
        onCoachLoad={vi.fn()}
        coachLoadDisabled={false}
        coachFocusLabel="Ver en riesgo"
        coachFocusActionId="web.nutritionCoachView.focusAtRisk"
        onCoachFocusAtRisk={vi.fn()}
        coachOpenOperationsLabel="Abrir operaciones"
        coachOpenOperationsActionId="web.nutritionCoachView.openOperations"
        onCoachOpenOperations={vi.fn()}
        athletesLoadedLabel="Atletas cargados"
        athletesLoadedValue="1"
        athletesAtRiskLabel="En riesgo"
        athletesAtRiskValue="1"
        coachEmptyLabel="Sin atletas"
        coachRows={[
          {
            athleteId: "athlete-1",
            plansCount: 2,
            sessionsCount: 5,
            nutritionLogsCount: 3,
            lastSessionDate: "2026-03-06",
            riskLevel: "attention"
          }
        ]}
        plansLabel="planes"
        sessionsLabel="sesiones"
        nutritionLabel="nutricion"
        lastSessionLabel="ultima sesion"
        riskAttentionLabel="Atencion"
        riskNormalLabel="Normal"
        riskClassName={() => "critical"}
        showCohortView={true}
        cohortScreenId="web.light.cohortNutrition.screen"
        cohortRouteId="web.route.cohortNutrition"
        cohortStatusId="web.light.cohortNutrition.status"
        cohortTitle="Cohorte nutricional"
        cohortSummary="Resumen cohorte"
        cohortLoadLabel="Cargar cohorte secundaria"
        cohortLoadActionId="web.light.cohortNutrition.loadCohort"
        onCohortLoad={vi.fn()}
        cohortLoadDisabled={false}
        cohortFocusLabel="Foco mayor riesgo"
        cohortFocusActionId="web.light.cohortNutrition.focusHighestRisk"
        onCohortFocusHighestRisk={vi.fn()}
        cohortRows={[
          {
            athleteId: "athlete-2",
            logsCount: 4,
            averageCalories: 2400,
            averageProteinGrams: 180,
            riskLevel: "normal"
          }
        ]}
        cohortRowsLoadedValue="1"
        cohortAtRiskValue="0"
        cohortEmptyLabel="Sin cohortes"
        cohortLogsLabel="logs"
        cohortAvgCaloriesLabel="avg kcal"
        cohortAvgProteinLabel="avg protein"
      />
    );

    expect(markup).toContain("athlete-1");
    expect(markup).toContain("planes 2");
    expect(markup).toContain("sesiones 5");
    expect(markup).toContain("nutricion 3");
    expect(markup).toContain("ultima sesion 2026-03-06");
    expect(markup).toContain("status-pill status-critical");
    expect(markup).toContain("athlete-2");
    expect(markup).toContain("logs 4");
    expect(markup).toContain("avg kcal 2400");
    expect(markup).toContain("avg protein 180");
  });
});
