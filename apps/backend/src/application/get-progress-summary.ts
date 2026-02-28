import {
  progressSummarySchema,
  type ProgressHistoryEntry,
  type ProgressSummary
} from "@flux/contracts";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

function roundMetric(value: number): number {
  return Math.round(value * 100) / 100;
}

function sessionDurationMinutes(startedAt: string, endedAt: string): number {
  const startTime = Date.parse(startedAt);
  const endTime = Date.parse(endedAt);
  if (Number.isFinite(startTime) === false || Number.isFinite(endTime) === false) {
    return 0;
  }
  if (endTime <= startTime) {
    return 0;
  }
  return roundMetric((endTime - startTime) / 60000);
}

function makeEmptyHistoryEntry(date: string): ProgressHistoryEntry {
  return {
    date,
    workoutSessions: 0,
    trainingMinutes: 0,
    completedSets: 0,
    calories: null,
    proteinGrams: null,
    carbsGrams: null,
    fatsGrams: null
  };
}

export class GetProgressSummaryUseCase {
  constructor(
    private readonly workoutSessionRepository: WorkoutSessionRepository,
    private readonly nutritionLogRepository: NutritionLogRepository
  ) {}

  async execute(userId: string, generatedAt: string = new Date().toISOString()): Promise<ProgressSummary> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }

    const [sessions, logs] = await Promise.all([
      this.workoutSessionRepository.listByUserId(userId),
      this.nutritionLogRepository.listByUserId(userId)
    ]);

    const historyByDate = new Map<string, ProgressHistoryEntry>();
    let totalTrainingMinutes = 0;
    let totalCompletedSets = 0;

    for (const session of sessions) {
      const date = session.startedAt.slice(0, 10);
      const durationMinutes = sessionDurationMinutes(session.startedAt, session.endedAt);
      const completedSets = session.exercises.reduce(
        (sessionSetCount, exercise) => sessionSetCount + exercise.sets.length,
        0
      );

      totalTrainingMinutes += durationMinutes;
      totalCompletedSets += completedSets;

      const current = historyByDate.get(date) ?? makeEmptyHistoryEntry(date);
      historyByDate.set(date, {
        ...current,
        workoutSessions: current.workoutSessions + 1,
        trainingMinutes: roundMetric(current.trainingMinutes + durationMinutes),
        completedSets: current.completedSets + completedSets
      });
    }

    let caloriesTotal = 0;
    let proteinTotal = 0;
    let carbsTotal = 0;
    let fatsTotal = 0;

    for (const log of logs) {
      caloriesTotal += log.calories;
      proteinTotal += log.proteinGrams;
      carbsTotal += log.carbsGrams;
      fatsTotal += log.fatsGrams;

      const current = historyByDate.get(log.date) ?? makeEmptyHistoryEntry(log.date);
      historyByDate.set(log.date, {
        ...current,
        calories: roundMetric((current.calories ?? 0) + log.calories),
        proteinGrams: roundMetric((current.proteinGrams ?? 0) + log.proteinGrams),
        carbsGrams: roundMetric((current.carbsGrams ?? 0) + log.carbsGrams),
        fatsGrams: roundMetric((current.fatsGrams ?? 0) + log.fatsGrams)
      });
    }

    const logCount = logs.length;
    const history = Array.from(historyByDate.values()).sort((left, right) =>
      left.date.localeCompare(right.date)
    );

    return progressSummarySchema.parse({
      userId,
      generatedAt,
      workoutSessionsCount: sessions.length,
      totalTrainingMinutes: roundMetric(totalTrainingMinutes),
      totalCompletedSets,
      nutritionLogsCount: logCount,
      averageCalories: logCount === 0 ? 0 : roundMetric(caloriesTotal / logCount),
      averageProteinGrams: logCount === 0 ? 0 : roundMetric(proteinTotal / logCount),
      averageCarbsGrams: logCount === 0 ? 0 : roundMetric(carbsTotal / logCount),
      averageFatsGrams: logCount === 0 ? 0 : roundMetric(fatsTotal / logCount),
      history
    });
  }
}
