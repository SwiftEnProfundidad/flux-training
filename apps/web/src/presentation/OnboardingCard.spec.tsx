import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { OnboardingCard } from "./OnboardingCard";

const baseProps = {
  title: "Onboarding + PAR-Q+",
  statusLabel: "Onboarding",
  statusValue: "inactivo",
  statusClass: "idle",
  displayNameLabel: "Nombre",
  displayName: "Juan",
  onDisplayNameChange: vi.fn(),
  ageLabel: "Edad",
  age: "35",
  onAgeChange: vi.fn(),
  heightLabel: "Altura",
  height: "178",
  onHeightChange: vi.fn(),
  weightLabel: "Peso",
  weight: "84",
  onWeightChange: vi.fn(),
  daysPerWeekLabel: "Dias por semana",
  daysPerWeek: "4",
  onDaysPerWeekChange: vi.fn(),
  goalLabel: "Objetivo",
  goal: "recomposition" as const,
  goalOptions: {
    fatLoss: "Perdida de grasa",
    recomposition: "Recomposicion",
    muscleGain: "Hipertrofia",
    habit: "Habito"
  },
  onGoalChange: vi.fn(),
  parQ1Label: "PAR-Q pregunta 1",
  parQ1: false,
  onParQ1Change: vi.fn(),
  parQ2Label: "PAR-Q pregunta 2",
  parQ2: false,
  onParQ2Change: vi.fn(),
  completeLabel: "Completar onboarding",
  onComplete: vi.fn()
};

describe("OnboardingCard", () => {
  it("renders status by default", () => {
    const markup = renderToStaticMarkup(<OnboardingCard {...baseProps} />);

    expect(markup).toContain("Onboarding");
    expect(markup).toContain("inactivo");
    expect(markup).toContain("Completar onboarding");
  });

  it("hides status in product mode", () => {
    const markup = renderToStaticMarkup(<OnboardingCard {...baseProps} showStatus={false} />);

    expect(markup).toContain("Onboarding + PAR-Q+");
    expect(markup).not.toContain("Onboarding:");
    expect(markup).not.toContain("status-pill");
  });
});
