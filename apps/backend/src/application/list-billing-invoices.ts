import {
  billingInvoiceSchema,
  type BillingInvoice,
  type NutritionLog,
  type TrainingPlan,
  type WorkoutSessionInput
} from "@flux/contracts";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";
import type { TrainingPlanRepository } from "../domain/training-plan-repository";
import type { WorkoutSessionRepository } from "../domain/workout-session-repository";

export class ListBillingInvoicesUseCase {
  constructor(
    private readonly trainingPlanRepository: TrainingPlanRepository,
    private readonly workoutSessionRepository: WorkoutSessionRepository,
    private readonly nutritionLogRepository: NutritionLogRepository,
    private readonly now: () => string = () => new Date().toISOString()
  ) {}

  async execute(userId: string): Promise<BillingInvoice[]> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }

    const [plans, sessions, nutritionLogs] = await Promise.all([
      this.trainingPlanRepository.listByUserId(userId),
      this.workoutSessionRepository.listByUserId(userId),
      this.nutritionLogRepository.listByUserId(userId)
    ]);

    const invoices = buildInvoices(userId, plans, sessions, nutritionLogs, this.now());
    return billingInvoiceSchema.array().parse(invoices);
  }
}

function buildInvoices(
  userId: string,
  plans: TrainingPlan[],
  sessions: WorkoutSessionInput[],
  nutritionLogs: NutritionLog[],
  issuedAt: string
): BillingInvoice[] {
  const amountEUR = Number(
    Math.max(9, plans.length * 14 + sessions.length * 5 + nutritionLogs.length * 2).toFixed(2)
  );
  const period = resolveBillingPeriod(sessions, nutritionLogs);

  const invoiceStatuses: BillingInvoice["status"][] = ["open", "paid", "overdue", "draft"];

  const invoices = invoiceStatuses.map((status, index) => {
    const source: BillingInvoice["source"] = plans.length === 0 ? "manual" : "auto";
    return {
      id: `INV-${String(index + 1).padStart(4, "0")}`,
      userId,
      period,
      amountEUR,
      status,
      source,
      issuedAt
    };
  });

  return invoices;
}

function resolveBillingPeriod(
  sessions: WorkoutSessionInput[],
  nutritionLogs: NutritionLog[]
): string {
  const latestSessionDate = sessions
    .map((session) => session.endedAt)
    .sort((left, right) => right.localeCompare(left))[0];

  if (typeof latestSessionDate === "string") {
    return latestSessionDate.slice(0, 7);
  }

  const latestNutritionDate = nutritionLogs
    .map((log) => log.date)
    .sort((left, right) => right.localeCompare(left))[0];

  if (typeof latestNutritionDate === "string") {
    return latestNutritionDate.slice(0, 7);
  }

  return "1970-01";
}
