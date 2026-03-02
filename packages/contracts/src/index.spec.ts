import { describe, expect, it } from "vitest";
import {
  aiRecommendationSchema,
  analyticsEventSchema,
  authRecoveryRequestSchema,
  authRecoveryResultSchema,
  authSessionSchema,
  billingInvoiceSchema,
  crashReportSchema,
  dataDeletionRequestSchema,
  exerciseVideoSchema,
  legalConsentSchema,
  legalConsentSubmissionSchema,
  onboardingProfileInputSchema,
  onboardingResultSchema,
  onboardingSubmissionInputSchema,
  nutritionLogSchema,
  progressSummarySchema,
  roleCapabilitiesSchema,
  supportIncidentSchema,
  syncQueueProcessInputSchema,
  syncQueueProcessResultSchema,
  trainingPlanSchema,
  workoutSessionInputSchema
} from "./index";

describe("workoutSessionInputSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = workoutSessionInputSchema.safeParse({
      userId: "user-1",
      planId: "plan-a",
      startedAt: "2026-02-25T10:00:00.000Z",
      endedAt: "2026-02-25T11:00:00.000Z",
      exercises: [
        {
          exerciseId: "squat",
          sets: [
            {
              reps: 8,
              loadKg: 40,
              rpe: 7
            }
          ]
        }
      ]
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects payload without exercises", () => {
    const parsed = workoutSessionInputSchema.safeParse({
      userId: "user-1",
      planId: "plan-a",
      startedAt: "2026-02-25T10:00:00.000Z",
      endedAt: "2026-02-25T11:00:00.000Z",
      exercises: []
    });

    expect(parsed.success).toBe(false);
  });
});

describe("nutritionLogSchema", () => {
  it("accepts calories and macros", () => {
    const parsed = nutritionLogSchema.safeParse({
      userId: "user-1",
      date: "2026-02-25",
      calories: 2200,
      proteinGrams: 150,
      carbsGrams: 230,
      fatsGrams: 70
    });

    expect(parsed.success).toBe(true);
  });
});

describe("progressSummarySchema", () => {
  it("accepts valid aggregated metrics and history", () => {
    const parsed = progressSummarySchema.safeParse({
      userId: "user-1",
      generatedAt: "2026-02-26T10:00:00.000Z",
      workoutSessionsCount: 2,
      totalTrainingMinutes: 95,
      totalCompletedSets: 7,
      nutritionLogsCount: 2,
      averageCalories: 2150,
      averageProteinGrams: 148,
      averageCarbsGrams: 232,
      averageFatsGrams: 66,
      history: [
        {
          date: "2026-02-25",
          workoutSessions: 1,
          trainingMinutes: 50,
          completedSets: 4,
          calories: 2200,
          proteinGrams: 150,
          carbsGrams: 230,
          fatsGrams: 70
        },
        {
          date: "2026-02-26",
          workoutSessions: 1,
          trainingMinutes: 45,
          completedSets: 3,
          calories: 2100,
          proteinGrams: 146,
          carbsGrams: 234,
          fatsGrams: 62
        }
      ]
    });

    expect(parsed.success).toBe(true);
  });
});

describe("analyticsEventSchema", () => {
  it("accepts analytics payload with attributes", () => {
    const parsed = analyticsEventSchema.safeParse({
      userId: "user-1",
      name: "screen_view",
      source: "web",
      occurredAt: "2026-02-27T10:00:00.000Z",
      attributes: {
        screen: "dashboard",
        queueSize: 2,
        fromPush: false
      }
    });

    expect(parsed.success).toBe(true);
  });
});

describe("crashReportSchema", () => {
  it("accepts crash report payload", () => {
    const parsed = crashReportSchema.safeParse({
      userId: "user-1",
      source: "ios",
      message: "Unexpected nil value",
      stackTrace: "MainViewModel.swift:42",
      correlationId: "corr-123",
      severity: "fatal",
      occurredAt: "2026-02-27T10:05:00.000Z"
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects empty correlation identifier", () => {
    const parsed = crashReportSchema.safeParse({
      userId: "user-1",
      source: "ios",
      message: "Unexpected nil value",
      severity: "warning",
      correlationId: "",
      occurredAt: "2026-02-27T10:05:00.000Z"
    });

    expect(parsed.success).toBe(false);
  });
});

describe("billingInvoiceSchema", () => {
  it("accepts billing invoice payload", () => {
    const parsed = billingInvoiceSchema.safeParse({
      id: "INV-0001",
      userId: "user-1",
      period: "2026-03",
      amountEUR: 49,
      status: "open",
      source: "auto",
      issuedAt: "2026-03-02T10:00:00.000Z"
    });

    expect(parsed.success).toBe(true);
  });
});

describe("supportIncidentSchema", () => {
  it("accepts support incident payload", () => {
    const parsed = supportIncidentSchema.safeParse({
      id: "INC-0001",
      userId: "user-1",
      openedAt: "2026-03-02T10:10:00.000Z",
      domain: "operations",
      severity: "high",
      state: "open",
      source: "analytics",
      summary: "dashboard_action_blocked · domain_denied",
      correlationId: "corr-1"
    });

    expect(parsed.success).toBe(true);
  });
});

describe("syncQueueProcessInputSchema", () => {
  it("accepts queued actions for synchronization", () => {
    const parsed = syncQueueProcessInputSchema.safeParse({
      userId: "user-1",
      items: [
        {
          id: "queue-1",
          userId: "user-1",
          enqueuedAt: "2026-02-27T10:00:00.000Z",
          action: {
            type: "create_workout_session",
            payload: {
              userId: "user-1",
              planId: "plan-1",
              startedAt: "2026-02-27T08:00:00.000Z",
              endedAt: "2026-02-27T08:30:00.000Z",
              exercises: [
                {
                  exerciseId: "squat",
                  sets: [{ reps: 8, loadKg: 60, rpe: 8 }]
                }
              ]
            }
          }
        }
      ]
    });

    expect(parsed.success).toBe(true);
  });
});

describe("syncQueueProcessResultSchema", () => {
  it("accepts sync result with accepted and rejected ids", () => {
    const parsed = syncQueueProcessResultSchema.safeParse({
      acceptedIds: ["queue-1"],
      rejected: [{ id: "queue-2", reason: "invalid_payload" }]
    });

    expect(parsed.success).toBe(true);
  });
});

describe("authSessionSchema", () => {
  it("accepts a valid auth session", () => {
    const parsed = authSessionSchema.safeParse({
      userId: "user-1",
      sessionId: "session-1",
      token: "jwt-token",
      issuedAt: "2026-02-25T11:30:00.000Z",
      expiresAt: "2026-02-25T12:00:00.000Z",
      rotationRequiredAt: "2026-02-25T11:40:00.000Z",
      absoluteExpiresAt: "2026-02-25T23:30:00.000Z",
      sessionPolicy: {
        maxIdleSeconds: 1800,
        rotationIntervalSeconds: 600,
        absoluteTtlSeconds: 43200
      },
      identity: {
        provider: "apple",
        providerUserId: "apple-user-123",
        email: "user@example.com",
        displayName: "User One"
      }
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid session policy values", () => {
    const parsed = authSessionSchema.safeParse({
      userId: "user-1",
      sessionId: "session-1",
      token: "jwt-token",
      issuedAt: "2026-02-25T11:30:00.000Z",
      expiresAt: "2026-02-25T12:00:00.000Z",
      rotationRequiredAt: "2026-02-25T11:40:00.000Z",
      absoluteExpiresAt: "2026-02-25T23:30:00.000Z",
      sessionPolicy: {
        maxIdleSeconds: 0,
        rotationIntervalSeconds: 600,
        absoluteTtlSeconds: 43200
      },
      identity: {
        provider: "apple",
        providerUserId: "apple-user-123",
        email: "user@example.com",
        displayName: "User One"
      }
    });

    expect(parsed.success).toBe(false);
  });
});

describe("authRecoveryRequestSchema", () => {
  it("accepts auth recovery request payload", () => {
    const parsed = authRecoveryRequestSchema.safeParse({
      channel: "email",
      identifier: "user@example.com"
    });

    expect(parsed.success).toBe(true);
  });
});

describe("authRecoveryResultSchema", () => {
  it("accepts auth recovery result payload", () => {
    const parsed = authRecoveryResultSchema.safeParse({
      channel: "sms",
      identifier: "+34123456789",
      status: "recovery_sent_sms",
      ticketId: "rec-sms-1",
      requestedAt: "2026-03-02T12:00:00.000Z"
    });

    expect(parsed.success).toBe(true);
  });
});

describe("roleCapabilitiesSchema", () => {
  it("accepts valid role capabilities payload", () => {
    const parsed = roleCapabilitiesSchema.safeParse({
      role: "coach",
      allowedDomains: ["all", "training", "nutrition", "progress", "operations"],
      issuedAt: "2026-03-01T10:00:00.000Z"
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects role capabilities without allowed domains", () => {
    const parsed = roleCapabilitiesSchema.safeParse({
      role: "athlete",
      allowedDomains: [],
      issuedAt: "2026-03-01T10:00:00.000Z"
    });

    expect(parsed.success).toBe(false);
  });
});

describe("onboardingProfileInputSchema", () => {
  it("accepts valid onboarding payload", () => {
    const parsed = onboardingProfileInputSchema.safeParse({
      displayName: "Juan",
      age: 35,
      heightCm: 178,
      weightKg: 84,
      availableDaysPerWeek: 4,
      equipment: ["dumbbells"],
      injuries: []
    });

    expect(parsed.success).toBe(true);
  });
});

describe("onboardingSubmissionInputSchema", () => {
  it("accepts onboarding submission payload", () => {
    const parsed = onboardingSubmissionInputSchema.safeParse({
      userId: "user-1",
      goal: "recomposition",
      onboardingProfile: {
        displayName: "Juan",
        age: 35,
        heightCm: 178,
        weightKg: 84,
        availableDaysPerWeek: 4,
        equipment: ["dumbbells"],
        injuries: []
      },
      responses: [{ questionId: "parq-1", answer: false }]
    });

    expect(parsed.success).toBe(true);
  });
});

describe("onboardingResultSchema", () => {
  it("accepts onboarding result payload", () => {
    const parsed = onboardingResultSchema.safeParse({
      profile: {
        id: "user-1",
        displayName: "Juan",
        goal: "recomposition",
        age: 35,
        heightCm: 178,
        weightKg: 84,
        createdAt: "2026-02-25T13:00:00.000Z"
      },
      screening: {
        userId: "user-1",
        responses: [{ questionId: "parq-1", answer: true }],
        risk: "moderate",
        reviewedAt: "2026-02-25T13:00:00.000Z"
      }
    });

    expect(parsed.success).toBe(true);
  });
});

describe("legalConsentSubmissionSchema", () => {
  it("accepts a valid legal consent submission", () => {
    const parsed = legalConsentSubmissionSchema.safeParse({
      userId: "user-1",
      acceptedAt: "2026-02-26T10:00:00.000Z",
      privacyPolicyAccepted: true,
      termsAccepted: true,
      medicalDisclaimerAccepted: true
    });

    expect(parsed.success).toBe(true);
  });
});

describe("legalConsentSchema", () => {
  it("accepts a persisted legal consent payload", () => {
    const parsed = legalConsentSchema.safeParse({
      userId: "user-1",
      acceptedAt: "2026-02-26T10:00:00.000Z",
      privacyPolicyAccepted: true,
      termsAccepted: true,
      medicalDisclaimerAccepted: true
    });

    expect(parsed.success).toBe(true);
  });
});

describe("dataDeletionRequestSchema", () => {
  it("accepts a valid data deletion request", () => {
    const parsed = dataDeletionRequestSchema.safeParse({
      userId: "user-1",
      requestedAt: "2026-02-26T10:00:00.000Z",
      reason: "user_request",
      status: "pending"
    });

    expect(parsed.success).toBe(true);
  });
});

describe("trainingPlanSchema", () => {
  it("accepts training plan payload", () => {
    const parsed = trainingPlanSchema.safeParse({
      id: "plan-1",
      userId: "user-1",
      name: "Starter Plan",
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [
            {
              exerciseId: "goblet-squat",
              targetSets: 4,
              targetReps: 10
            }
          ]
        }
      ],
      createdAt: "2026-02-25T13:00:00.000Z"
    });

    expect(parsed.success).toBe(true);
  });
});

describe("exerciseVideoSchema", () => {
  it("accepts exercise videos with playback metadata", () => {
    const parsed = exerciseVideoSchema.safeParse({
      id: "video-goblet-squat",
      exerciseId: "goblet-squat",
      title: "Goblet Squat Fundamentals",
      coach: "Flux Coach",
      difficulty: "beginner",
      durationSeconds: 185,
      videoUrl: "https://cdn.flux.training/videos/goblet-squat.mp4",
      thumbnailUrl: "https://cdn.flux.training/videos/goblet-squat.jpg",
      tags: ["legs", "squat", "form"],
      locale: "es-ES"
    });

    expect(parsed.success).toBe(true);
  });
});

describe("aiRecommendationSchema", () => {
  it("accepts recommendation payload with retention metadata", () => {
    const parsed = aiRecommendationSchema.safeParse({
      id: "rec-001",
      userId: "user-1",
      title: "Completa una sesion corta hoy",
      rationale: "Llevas 2 dias sin entrenar y una sesion breve mantiene adherencia.",
      priority: "high",
      category: "training",
      expectedImpact: "retention",
      actionLabel: "Iniciar sesion de 20 min",
      generatedAt: "2026-03-01T10:00:00.000Z"
    });

    expect(parsed.success).toBe(true);
  });
});
