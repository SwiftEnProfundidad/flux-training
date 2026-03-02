import { z } from "zod";

export const goalSchema = z.enum([
  "fat_loss",
  "recomposition",
  "muscle_gain",
  "habit"
]);

export const healthRiskSchema = z.enum([
  "low",
  "moderate",
  "high"
]);

export const userProfileSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  goal: goalSchema,
  age: z.number().int().min(18),
  heightCm: z.number().positive(),
  weightKg: z.number().positive(),
  createdAt: z.string().datetime()
});

export const parQResponseSchema = z.object({
  questionId: z.string().min(1),
  answer: z.boolean()
});

export const onboardingProfileInputSchema = z.object({
  displayName: z.string().min(1),
  age: z.number().int().min(18),
  heightCm: z.number().positive(),
  weightKg: z.number().positive(),
  availableDaysPerWeek: z.number().int().min(1).max(7),
  equipment: z.array(z.string()).default([]),
  injuries: z.array(z.string()).default([])
});

export const healthScreeningSchema = z.object({
  userId: z.string().min(1),
  responses: z.array(parQResponseSchema).min(1),
  risk: healthRiskSchema,
  reviewedAt: z.string().datetime()
});

export const onboardingSubmissionInputSchema = z.object({
  userId: z.string().min(1),
  goal: goalSchema,
  onboardingProfile: onboardingProfileInputSchema,
  responses: z.array(parQResponseSchema).min(1)
});

export const onboardingResultSchema = z.object({
  profile: userProfileSchema,
  screening: healthScreeningSchema
});

export const legalConsentSubmissionSchema = z.object({
  userId: z.string().min(1),
  acceptedAt: z.string().datetime(),
  privacyPolicyAccepted: z.boolean(),
  termsAccepted: z.boolean(),
  medicalDisclaimerAccepted: z.boolean()
});

export const legalConsentSchema = legalConsentSubmissionSchema;

export const dataDeletionRequestStatusSchema = z.enum([
  "pending",
  "completed",
  "rejected"
]);

export const dataDeletionRequestSchema = z.object({
  userId: z.string().min(1),
  requestedAt: z.string().datetime(),
  reason: z.string().min(1).optional(),
  status: dataDeletionRequestStatusSchema.default("pending")
});

export const setLogSchema = z.object({
  reps: z.number().int().positive(),
  loadKg: z.number().min(0),
  rpe: z.number().min(1).max(10)
});

export const trainingExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  targetSets: z.number().int().positive(),
  targetReps: z.number().int().positive()
});

export const exerciseVideoDifficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced"
]);

export const exerciseVideoSchema = z.object({
  id: z.string().min(1),
  exerciseId: z.string().min(1),
  title: z.string().min(1),
  coach: z.string().min(1),
  difficulty: exerciseVideoDifficultySchema,
  durationSeconds: z.number().int().positive(),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  tags: z.array(z.string().min(1)).default([]),
  locale: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/)
});

export const trainingDaySchema = z.object({
  dayIndex: z.number().int().min(1).max(7),
  exercises: z.array(trainingExerciseSchema).min(1)
});

export const trainingPlanSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  name: z.string().min(1),
  weeks: z.number().int().positive(),
  days: z.array(trainingDaySchema).min(1),
  createdAt: z.string().datetime()
});

export const exerciseLogSchema = z.object({
  exerciseId: z.string().min(1),
  sets: z.array(setLogSchema).min(1)
});

export const workoutSessionInputSchema = z.object({
  userId: z.string().min(1),
  planId: z.string().min(1),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime(),
  exercises: z.array(exerciseLogSchema).min(1)
});

export const nutritionLogSchema = z.object({
  userId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  calories: z.number().min(0),
  proteinGrams: z.number().min(0),
  carbsGrams: z.number().min(0),
  fatsGrams: z.number().min(0)
});

export const progressHistoryEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  workoutSessions: z.number().int().min(0),
  trainingMinutes: z.number().min(0),
  completedSets: z.number().int().min(0),
  calories: z.number().min(0).nullable(),
  proteinGrams: z.number().min(0).nullable(),
  carbsGrams: z.number().min(0).nullable(),
  fatsGrams: z.number().min(0).nullable()
});

export const progressSummarySchema = z.object({
  userId: z.string().min(1),
  generatedAt: z.string().datetime(),
  workoutSessionsCount: z.number().int().min(0),
  totalTrainingMinutes: z.number().min(0),
  totalCompletedSets: z.number().int().min(0),
  nutritionLogsCount: z.number().int().min(0),
  averageCalories: z.number().min(0),
  averageProteinGrams: z.number().min(0),
  averageCarbsGrams: z.number().min(0),
  averageFatsGrams: z.number().min(0),
  history: z.array(progressHistoryEntrySchema)
});

export const authProviderSchema = z.enum(["apple", "email"]);

export const authIdentitySchema = z.object({
  provider: authProviderSchema,
  providerUserId: z.string().min(1),
  email: z.string().email().optional(),
  displayName: z.string().min(1).optional()
});

export const authSessionSchema = z.object({
  userId: z.string().min(1),
  token: z.string().min(1),
  expiresAt: z.string().datetime(),
  identity: authIdentitySchema
});

export const dashboardDomainSchema = z.enum([
  "all",
  "onboarding",
  "training",
  "nutrition",
  "progress",
  "operations"
]);

export const accessRoleSchema = z.enum(["athlete", "coach", "admin"]);

export const roleCapabilitiesSchema = z.object({
  role: accessRoleSchema,
  allowedDomains: z.array(dashboardDomainSchema).min(1),
  issuedAt: z.string().datetime()
});

export const observabilitySourceSchema = z.enum(["web", "ios", "backend"]);

export const analyticsEventSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  source: observabilitySourceSchema,
  occurredAt: z.string().datetime(),
  attributes: z
    .record(z.union([z.string(), z.number(), z.boolean()]))
    .default({})
});

export const crashSeveritySchema = z.enum(["warning", "fatal"]);

export const crashReportSchema = z.object({
  userId: z.string().min(1),
  source: observabilitySourceSchema,
  message: z.string().min(1),
  stackTrace: z.string().optional(),
  severity: crashSeveritySchema,
  occurredAt: z.string().datetime()
});

export const billingInvoiceStatusSchema = z.enum([
  "draft",
  "open",
  "paid",
  "overdue"
]);

export const billingInvoiceSourceSchema = z.enum(["auto", "manual"]);

export const billingInvoiceSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  period: z.string().regex(/^\d{4}-\d{2}$/),
  amountEUR: z.number().nonnegative(),
  status: billingInvoiceStatusSchema,
  source: billingInvoiceSourceSchema,
  issuedAt: z.string().datetime()
});

export const supportIncidentSeveritySchema = z.enum([
  "low",
  "medium",
  "high"
]);

export const supportIncidentStateSchema = z.enum([
  "open",
  "in_progress",
  "resolved"
]);

export const supportIncidentSourceSchema = z.enum([
  "analytics",
  "crash",
  "operator"
]);

export const supportIncidentSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  openedAt: z.string().datetime(),
  domain: z.string().min(1),
  severity: supportIncidentSeveritySchema,
  state: supportIncidentStateSchema,
  source: supportIncidentSourceSchema,
  summary: z.string().min(1),
  correlationId: z.string().min(1)
});

export const aiRecommendationPrioritySchema = z.enum([
  "high",
  "medium",
  "low"
]);

export const aiRecommendationCategorySchema = z.enum([
  "training",
  "nutrition",
  "recovery",
  "sync",
  "legal"
]);

export const aiRecommendationImpactSchema = z.enum([
  "retention",
  "consistency",
  "safety",
  "performance"
]);

export const aiRecommendationSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  title: z.string().min(1),
  rationale: z.string().min(1),
  priority: aiRecommendationPrioritySchema,
  category: aiRecommendationCategorySchema,
  expectedImpact: aiRecommendationImpactSchema,
  actionLabel: z.string().min(1),
  generatedAt: z.string().datetime()
});

export const syncQueueActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("create_training_plan"),
    payload: trainingPlanSchema.omit({ createdAt: true })
  }),
  z.object({
    type: z.literal("create_workout_session"),
    payload: workoutSessionInputSchema
  }),
  z.object({
    type: z.literal("create_nutrition_log"),
    payload: nutritionLogSchema
  })
]);

export const syncQueueItemSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  enqueuedAt: z.string().datetime(),
  action: syncQueueActionSchema
});

export const syncQueueProcessInputSchema = z.object({
  userId: z.string().min(1),
  items: z.array(syncQueueItemSchema)
});

export const syncQueueRejectedItemSchema = z.object({
  id: z.string().min(1),
  reason: z.string().min(1)
});

export const syncQueueProcessResultSchema = z.object({
  acceptedIds: z.array(z.string().min(1)),
  rejected: z.array(syncQueueRejectedItemSchema)
});

export type Goal = z.infer<typeof goalSchema>;
export type HealthRisk = z.infer<typeof healthRiskSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type OnboardingProfileInput = z.infer<typeof onboardingProfileInputSchema>;
export type ParQResponse = z.infer<typeof parQResponseSchema>;
export type HealthScreening = z.infer<typeof healthScreeningSchema>;
export type OnboardingSubmissionInput = z.infer<typeof onboardingSubmissionInputSchema>;
export type OnboardingResult = z.infer<typeof onboardingResultSchema>;
export type LegalConsentSubmission = z.infer<typeof legalConsentSubmissionSchema>;
export type LegalConsent = z.infer<typeof legalConsentSchema>;
export type DataDeletionRequestStatus = z.infer<typeof dataDeletionRequestStatusSchema>;
export type DataDeletionRequest = z.infer<typeof dataDeletionRequestSchema>;
export type SetLog = z.infer<typeof setLogSchema>;
export type TrainingExercise = z.infer<typeof trainingExerciseSchema>;
export type ExerciseVideoDifficulty = z.infer<typeof exerciseVideoDifficultySchema>;
export type ExerciseVideo = z.infer<typeof exerciseVideoSchema>;
export type TrainingDay = z.infer<typeof trainingDaySchema>;
export type TrainingPlan = z.infer<typeof trainingPlanSchema>;
export type ExerciseLog = z.infer<typeof exerciseLogSchema>;
export type WorkoutSessionInput = z.infer<typeof workoutSessionInputSchema>;
export type NutritionLog = z.infer<typeof nutritionLogSchema>;
export type ProgressHistoryEntry = z.infer<typeof progressHistoryEntrySchema>;
export type ProgressSummary = z.infer<typeof progressSummarySchema>;
export type AuthProvider = z.infer<typeof authProviderSchema>;
export type AuthIdentity = z.infer<typeof authIdentitySchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type DashboardDomain = z.infer<typeof dashboardDomainSchema>;
export type AccessRole = z.infer<typeof accessRoleSchema>;
export type RoleCapabilities = z.infer<typeof roleCapabilitiesSchema>;
export type ObservabilitySource = z.infer<typeof observabilitySourceSchema>;
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
export type CrashSeverity = z.infer<typeof crashSeveritySchema>;
export type CrashReport = z.infer<typeof crashReportSchema>;
export type BillingInvoiceStatus = z.infer<typeof billingInvoiceStatusSchema>;
export type BillingInvoiceSource = z.infer<typeof billingInvoiceSourceSchema>;
export type BillingInvoice = z.infer<typeof billingInvoiceSchema>;
export type SupportIncidentSeverity = z.infer<typeof supportIncidentSeveritySchema>;
export type SupportIncidentState = z.infer<typeof supportIncidentStateSchema>;
export type SupportIncidentSource = z.infer<typeof supportIncidentSourceSchema>;
export type SupportIncident = z.infer<typeof supportIncidentSchema>;
export type AIRecommendationPriority = z.infer<typeof aiRecommendationPrioritySchema>;
export type AIRecommendationCategory = z.infer<typeof aiRecommendationCategorySchema>;
export type AIRecommendationImpact = z.infer<typeof aiRecommendationImpactSchema>;
export type AIRecommendation = z.infer<typeof aiRecommendationSchema>;
export type SyncQueueAction = z.infer<typeof syncQueueActionSchema>;
export type SyncQueueItem = z.infer<typeof syncQueueItemSchema>;
export type SyncQueueProcessInput = z.infer<typeof syncQueueProcessInputSchema>;
export type SyncQueueRejectedItem = z.infer<typeof syncQueueRejectedItemSchema>;
export type SyncQueueProcessResult = z.infer<typeof syncQueueProcessResultSchema>;
