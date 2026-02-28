import { aiRecommendationSchema, type AIRecommendation, type Goal } from "@flux/contracts";

type Input = {
  userId: string;
  goal: Goal;
  pendingQueueCount: number;
  daysSinceLastWorkout: number;
  recentCompletionRate: number;
  locale: string;
};

export class GenerateAIRecommendationsUseCase {
  constructor(private readonly nowISO: () => string = () => new Date().toISOString()) {}

  async execute(input: Input): Promise<AIRecommendation[]> {
    if (input.userId.length === 0) {
      throw new Error("missing_user_id");
    }

    const recommendations: AIRecommendation[] = [];
    const generatedAt = this.nowISO();
    const isSpanish = input.locale.startsWith("es");

    if (input.daysSinceLastWorkout >= 2) {
      recommendations.push({
        id: "rec-training-activation",
        userId: input.userId,
        title: isSpanish ? "Completa una sesion corta hoy" : "Complete a short session today",
        rationale: isSpanish
          ? "Llevas varios dias sin entrenar y una sesion breve protege tu adherencia semanal."
          : "Several days without training increase drop risk. A short session protects adherence.",
        priority: "high",
        category: "training",
        expectedImpact: "retention",
        actionLabel: isSpanish ? "Iniciar sesion de 20 min" : "Start a 20 min session",
        generatedAt
      });
    }

    if (input.pendingQueueCount > 0) {
      recommendations.push({
        id: "rec-sync-queue",
        userId: input.userId,
        title: isSpanish ? "Sincroniza tu cola offline" : "Sync your offline queue",
        rationale: isSpanish
          ? "Tienes acciones pendientes y sincronizar evita perdida de trazabilidad."
          : "You have pending actions and sync keeps your data history accurate.",
        priority: input.pendingQueueCount > 2 ? "high" : "medium",
        category: "sync",
        expectedImpact: "consistency",
        actionLabel: isSpanish ? "Sincronizar ahora" : "Sync now",
        generatedAt
      });
    }

    if (input.recentCompletionRate < 0.6) {
      recommendations.push({
        id: "rec-recovery-load",
        userId: input.userId,
        title: isSpanish
          ? "Ajusta la carga para recuperar ritmo"
          : "Adjust load to recover your rhythm",
        rationale: isSpanish
          ? "Tu tasa reciente de completitud esta baja; reduce volumen para volver a la rutina."
          : "Your recent completion rate is low; reduce volume to restore consistency.",
        priority: "medium",
        category: "recovery",
        expectedImpact: "retention",
        actionLabel: isSpanish ? "Aplicar semana de ajuste" : "Apply adjustment week",
        generatedAt
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        id: "rec-maintain-momentum",
        userId: input.userId,
        title: isSpanish ? "Mantener el momentum" : "Keep momentum",
        rationale: isSpanish
          ? "Tu adherencia es estable; mantener consistencia consolidara resultados."
          : "Your adherence is stable; consistency will consolidate results.",
        priority: "low",
        category: input.goal === "muscle_gain" ? "training" : "nutrition",
        expectedImpact: "performance",
        actionLabel: isSpanish ? "Seguir plan semanal" : "Continue weekly plan",
        generatedAt
      });
    }

    const prioritized = recommendations.sort((left, right) => {
      const rank = { high: 3, medium: 2, low: 1 } as const;
      return rank[right.priority] - rank[left.priority];
    });

    return aiRecommendationSchema.array().parse(prioritized);
  }
}
