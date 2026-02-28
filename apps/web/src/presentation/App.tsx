import { useEffect, useMemo, useState } from "react";
import type {
  AIRecommendation,
  AnalyticsEvent,
  CrashReport,
  ExerciseVideo,
  Goal,
  NutritionLog,
  ProgressSummary,
  TrainingPlan,
  WorkoutSessionInput
} from "@flux/contracts";
import { CompleteOnboardingUseCase } from "../application/complete-onboarding";
import { ManageNutritionUseCase } from "../application/manage-nutrition";
import { ManageObservabilityUseCase } from "../application/manage-observability";
import { OfflineSyncQueueUseCase } from "../application/offline-sync-queue";
import { ManageLegalUseCase } from "../application/manage-legal";
import { ManageProgressUseCase } from "../application/manage-progress";
import { ManageTrainingUseCase } from "../application/manage-training";
import { ManageRecommendationsUseCase } from "../application/manage-recommendations";
import { CreateAuthSessionUseCase } from "../domain/auth";
import { firebaseAuthGateway } from "../infrastructure/firebase-auth-client";
import { localStorageOfflineQueueStore } from "../infrastructure/local-storage-offline-queue-store";
import { apiNutritionGateway } from "../infrastructure/nutrition-client";
import { apiObservabilityGateway } from "../infrastructure/observability-client";
import { apiOnboardingGateway } from "../infrastructure/onboarding-client";
import { apiOfflineSyncGateway } from "../infrastructure/sync-client";
import { apiProgressGateway } from "../infrastructure/progress-client";
import { apiTrainingGateway } from "../infrastructure/training-client";
import { apiRecommendationsGateway } from "../infrastructure/recommendations-client";
import { isClientUpdateRequiredError } from "../infrastructure/api-client";
import { apiLegalGateway } from "../infrastructure/legal-client";
import { buildUXReadinessSnapshot, type UXReadinessSnapshot } from "./ux-readiness";
import {
  createTranslator,
  goalLabel,
  humanizeStatus,
  readinessLabel,
  resolveLanguage,
  type AppLanguage
} from "./i18n";
import "./app.css";

type SessionStatus = "idle" | "saved" | "error";
type OnboardingStatus = "idle" | "saved" | "error";
type TrainingStatus = "idle" | "saved" | "loaded" | "queued" | "error";
type NutritionStatus = "idle" | "saved" | "loaded" | "queued" | "error";
type ProgressStatus = "idle" | "loaded" | "error";
type SyncStatus = "idle" | "synced" | "error";
type ObservabilityStatus = "idle" | "event_saved" | "crash_saved" | "loaded" | "error";
type ReleaseCompatibilityStatus = "compatible" | "upgrade_required";
type LegalStatus = "idle" | "consent_saved" | "deletion_requested" | "error";
type VideoStatus = "idle" | "loaded" | "error";
type RecommendationsStatus = "idle" | "loaded" | "error";

const demoUserId = "demo-user";
const languageStorageKey = "flux_training_language";

export function App() {
  const createAuthSessionUseCase = useMemo(
    () => new CreateAuthSessionUseCase(firebaseAuthGateway),
    []
  );
  const completeOnboardingUseCase = useMemo(
    () => new CompleteOnboardingUseCase(apiOnboardingGateway),
    []
  );
  const manageTrainingUseCase = useMemo(() => new ManageTrainingUseCase(apiTrainingGateway), []);
  const manageNutritionUseCase = useMemo(
    () => new ManageNutritionUseCase(apiNutritionGateway),
    []
  );
  const manageLegalUseCase = useMemo(() => new ManageLegalUseCase(apiLegalGateway), []);
  const manageObservabilityUseCase = useMemo(
    () => new ManageObservabilityUseCase(apiObservabilityGateway),
    []
  );
  const offlineSyncQueueUseCase = useMemo(
    () => new OfflineSyncQueueUseCase(localStorageOfflineQueueStore, apiOfflineSyncGateway),
    []
  );
  const manageProgressUseCase = useMemo(() => new ManageProgressUseCase(apiProgressGateway), []);
  const manageRecommendationsUseCase = useMemo(
    () => new ManageRecommendationsUseCase(apiRecommendationsGateway),
    []
  );

  const [authStatus, setAuthStatus] = useState("signed_out");
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>("idle");
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>("idle");
  const [nutritionStatus, setNutritionStatus] = useState<NutritionStatus>("idle");
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>("idle");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [observabilityStatus, setObservabilityStatus] = useState<ObservabilityStatus>("idle");
  const [releaseCompatibilityStatus, setReleaseCompatibilityStatus] =
    useState<ReleaseCompatibilityStatus>("compatible");
  const [legalStatus, setLegalStatus] = useState<LegalStatus>("idle");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("Juan");
  const [age, setAge] = useState("35");
  const [heightCm, setHeightCm] = useState("178");
  const [weightKg, setWeightKg] = useState("84");
  const [availableDaysPerWeek, setAvailableDaysPerWeek] = useState("4");
  const [goal, setGoal] = useState<Goal>("recomposition");
  const [parQ1, setParQ1] = useState(false);
  const [parQ2, setParQ2] = useState(false);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [medicalDisclaimerAccepted, setMedicalDisclaimerAccepted] = useState(false);

  const [planName, setPlanName] = useState("Starter Plan");
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [sessions, setSessions] = useState<WorkoutSessionInput[]>([]);
  const [nutritionDate, setNutritionDate] = useState("2026-02-26");
  const [calories, setCalories] = useState("2200");
  const [proteinGrams, setProteinGrams] = useState("150");
  const [carbsGrams, setCarbsGrams] = useState("230");
  const [fatsGrams, setFatsGrams] = useState("70");
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  const [lastSyncRejectedCount, setLastSyncRejectedCount] = useState(0);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [crashReports, setCrashReports] = useState<CrashReport[]>([]);
  const [exerciseVideos, setExerciseVideos] = useState<ExerciseVideo[]>([]);
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("idle");
  const [selectedExerciseForVideos, setSelectedExerciseForVideos] =
    useState("goblet-squat");
  const [videoLocale, setVideoLocale] = useState("es-ES");
  const [recommendationsStatus, setRecommendationsStatus] =
    useState<RecommendationsStatus>("idle");
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [language, setLanguage] = useState<AppLanguage>(() =>
    resolveLanguage(readLanguagePreference())
  );

  const translate = useMemo(() => createTranslator(language), [language]);

  const readiness = buildUXReadinessSnapshot({
    authStatus,
    onboardingStatus,
    trainingStatus,
    nutritionStatus,
    progressStatus,
    syncStatus,
    observabilityStatus,
    pendingQueueCount,
    releaseCompatibilityStatus
  });

  async function refreshPendingQueue(): Promise<void> {
    const pending = await offlineSyncQueueUseCase.listPending(demoUserId);
    setPendingQueueCount(pending.length);
  }

  function shouldStopForUpgrade(error: unknown): boolean {
    if (isClientUpdateRequiredError(error)) {
      setReleaseCompatibilityStatus("upgrade_required");
      return true;
    }
    return false;
  }

  useEffect(() => {
    void refreshPendingQueue();
  }, []);

  useEffect(() => {
    persistLanguagePreference(language);
  }, [language]);

  async function handleAppleSignIn() {
    try {
      const session = await createAuthSessionUseCase.executeWithApple();
      setAuthStatus(`signed_in:${session.identity.provider}`);
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setAuthStatus("auth_error");
    }
  }

  async function handleEmailSignIn() {
    try {
      const session = await createAuthSessionUseCase.executeWithEmail(email, password);
      setAuthStatus(`signed_in:${session.identity.provider}`);
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setAuthStatus("auth_error");
    }
  }

  async function handleCompleteOnboarding() {
    try {
      await completeOnboardingUseCase.execute({
        userId: demoUserId,
        goal,
        onboardingProfile: {
          displayName,
          age: Number(age),
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
          availableDaysPerWeek: Number(availableDaysPerWeek),
          equipment: ["dumbbells"],
          injuries: []
        },
        responses: [
          { questionId: "parq-1", answer: parQ1 },
          { questionId: "parq-2", answer: parQ2 }
        ]
      });
      setOnboardingStatus("saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setOnboardingStatus("error");
    }
  }

  async function handleSubmitLegalConsent() {
    try {
      await manageLegalUseCase.submitConsent({
        userId: demoUserId,
        acceptedAt: new Date().toISOString(),
        privacyPolicyAccepted,
        termsAccepted,
        medicalDisclaimerAccepted
      });
      setLegalStatus("consent_saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setLegalStatus("error");
    }
  }

  async function handleRequestDataDeletion() {
    try {
      await manageLegalUseCase.requestDataDeletion({
        userId: demoUserId,
        requestedAt: new Date().toISOString(),
        reason: "user_request",
        status: "pending"
      });
      setLegalStatus("deletion_requested");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setLegalStatus("error");
    }
  }

  async function handleCreatePlan() {
    const queuedPlanInput = {
      id: `plan-${Date.now()}`,
      userId: demoUserId,
      name: planName,
      weeks: 4,
      days: [
        {
          dayIndex: 1,
          exercises: [
            { exerciseId: "goblet-squat", targetSets: 4, targetReps: 10 },
            { exerciseId: "bench-press", targetSets: 4, targetReps: 8 }
          ]
        }
      ]
    } satisfies Omit<TrainingPlan, "createdAt">;

    try {
      const createdPlan = await manageTrainingUseCase.createTrainingPlan(queuedPlanInput);
      setSelectedPlanId(createdPlan.id);
      setTrainingStatus("saved");
      const loadedPlans = await manageTrainingUseCase.listTrainingPlans(demoUserId);
      setPlans(loadedPlans);
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      try {
        await offlineSyncQueueUseCase.queueTrainingPlan(demoUserId, queuedPlanInput);
        await refreshPendingQueue();
        setTrainingStatus("queued");
      } catch (queueError) {
        if (shouldStopForUpgrade(queueError)) {
          return;
        }
        setTrainingStatus("error");
      }
    }
  }

  async function handleLoadPlans() {
    try {
      const loadedPlans = await manageTrainingUseCase.listTrainingPlans(demoUserId);
      setPlans(loadedPlans);
      const firstPlan = loadedPlans[0];
      if (firstPlan !== undefined && selectedPlanId.length === 0) {
        setSelectedPlanId(firstPlan.id);
      }
      setTrainingStatus("loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setTrainingStatus("error");
    }
  }

  async function handleLogWorkoutSession() {
    const planId = selectedPlanId || plans[0]?.id;
    if (planId === undefined || planId.length === 0) {
      setSessionStatus("error");
      return;
    }
    const endedAt = new Date();
    const queuedSession = {
      userId: demoUserId,
      planId,
      startedAt: new Date(endedAt.getTime() - 35 * 60 * 1000).toISOString(),
      endedAt: endedAt.toISOString(),
      exercises: [
        {
          exerciseId: "goblet-squat",
          sets: [{ reps: 12, loadKg: 20, rpe: 7 }]
        }
      ]
    } satisfies WorkoutSessionInput;

    try {
      await manageTrainingUseCase.createWorkoutSession(queuedSession);
      setSessionStatus("saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      try {
        await offlineSyncQueueUseCase.queueWorkoutSession(demoUserId, queuedSession);
        await refreshPendingQueue();
        setSessionStatus("saved");
        setTrainingStatus("queued");
      } catch (queueError) {
        if (shouldStopForUpgrade(queueError)) {
          return;
        }
        setSessionStatus("error");
      }
    }
  }

  async function handleLoadSessions() {
    try {
      const loadedSessions = await manageTrainingUseCase.listWorkoutSessions(
        demoUserId,
        selectedPlanId || undefined
      );
      setSessions(loadedSessions);
      setSessionStatus("saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setSessionStatus("error");
    }
  }

  async function handleCreateNutritionLog() {
    const queuedLog = {
      userId: demoUserId,
      date: nutritionDate,
      calories: Number(calories),
      proteinGrams: Number(proteinGrams),
      carbsGrams: Number(carbsGrams),
      fatsGrams: Number(fatsGrams)
    } satisfies NutritionLog;

    try {
      await manageNutritionUseCase.createNutritionLog(queuedLog);
      setNutritionStatus("saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      try {
        await offlineSyncQueueUseCase.queueNutritionLog(demoUserId, queuedLog);
        await refreshPendingQueue();
        setNutritionStatus("queued");
      } catch (queueError) {
        if (shouldStopForUpgrade(queueError)) {
          return;
        }
        setNutritionStatus("error");
      }
    }
  }

  async function handleLoadNutritionLogs() {
    try {
      const logs = await manageNutritionUseCase.listNutritionLogs(demoUserId);
      setNutritionLogs(logs);
      setNutritionStatus("loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setNutritionStatus("error");
    }
  }

  async function handleLoadProgressSummary() {
    try {
      const summary = await manageProgressUseCase.getSummary(demoUserId);
      setProgressSummary(summary);
      setProgressStatus("loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setProgressStatus("error");
    }
  }

  async function handleSyncOfflineQueue() {
    try {
      const result = await offlineSyncQueueUseCase.syncPending(demoUserId);
      await refreshPendingQueue();
      setLastSyncRejectedCount(result.rejected.length);
      setSyncStatus("synced");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setSyncStatus("error");
    }
  }

  async function handleTrackAnalyticsEvent() {
    try {
      await manageObservabilityUseCase.createAnalyticsEvent({
        userId: demoUserId,
        name: "dashboard_interaction",
        source: "web",
        occurredAt: new Date().toISOString(),
        attributes: {
          pendingQueueCount,
          selectedPlan: selectedPlanId.length > 0
        }
      });
      setObservabilityStatus("event_saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setObservabilityStatus("error");
    }
  }

  async function handleReportDemoCrash() {
    try {
      try {
        throw new Error("Simulated crash for observability validation");
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown_error";
        const stackTrace = error instanceof Error ? error.stack : undefined;
        await manageObservabilityUseCase.createCrashReport({
          userId: demoUserId,
          source: "web",
          message,
          stackTrace,
          severity: "warning",
          occurredAt: new Date().toISOString()
        });
      }
      setObservabilityStatus("crash_saved");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setObservabilityStatus("error");
    }
  }

  async function handleLoadObservabilityData() {
    try {
      const [loadedEvents, loadedCrashReports] = await Promise.all([
        manageObservabilityUseCase.listAnalyticsEvents(demoUserId),
        manageObservabilityUseCase.listCrashReports(demoUserId)
      ]);
      setAnalyticsEvents(loadedEvents);
      setCrashReports(loadedCrashReports);
      setObservabilityStatus("loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setObservabilityStatus("error");
    }
  }

  async function handleLoadExerciseVideos() {
    try {
      const videos = await manageTrainingUseCase.listExerciseVideos(
        selectedExerciseForVideos,
        videoLocale
      );
      setExerciseVideos(videos);
      setVideoStatus("loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setVideoStatus("error");
    }
  }

  async function handleLoadRecommendations() {
    const estimatedDaysSinceWorkout = sessions.length === 0 ? 3 : 0;
    const estimatedCompletionRate =
      plans.length === 0 ? 0.4 : Math.min(1, sessions.length / Math.max(plans.length * 2, 1));

    try {
      const loadedRecommendations = await manageRecommendationsUseCase.listRecommendations(
        demoUserId,
        language === "es" ? "es-ES" : "en-US",
        {
          goal,
          pendingQueueCount,
          daysSinceLastWorkout: estimatedDaysSinceWorkout,
          recentCompletionRate: estimatedCompletionRate
        }
      );
      setRecommendations(loadedRecommendations);
      setRecommendationsStatus("loaded");
    } catch (error) {
      if (shouldStopForUpgrade(error)) {
        return;
      }
      setRecommendationsStatus("error");
    }
  }

  return (
    <div className={`app-shell tone-${readiness.tone}`}>
      <div className="app-background app-background-left" />
      <div className="app-background app-background-right" />
      <main className="app-main">
        <section className="hero-card">
          <div className="hero-content">
            <p className="eyebrow">{translate("appName")}</p>
            <h1>{translate("heroTitle")}</h1>
            <p className="hero-copy">{translate("heroCopy")}</p>
            <div className="hero-actions">
              <button className="button primary" onClick={handleAppleSignIn} type="button">
                {translate("signInWithApple")}
              </button>
              <div className="inline-inputs">
                <input
                  placeholder={translate("emailPlaceholder")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <input
                  placeholder={translate("passwordPlaceholder")}
                  value={password}
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button className="button ghost" onClick={handleEmailSignIn} type="button">
                  {translate("signInWithEmail")}
                </button>
              </div>
            </div>
          </div>
          <div className="language-toggle">
            <span>{translate("languageLabel")}</span>
            <div className="language-toggle-buttons">
              <button
                className={`button ghost language-button ${language === "es" ? "active" : ""}`}
                onClick={() => setLanguage("es")}
                type="button"
              >
                ES
              </button>
              <button
                className={`button ghost language-button ${language === "en" ? "active" : ""}`}
                onClick={() => setLanguage("en")}
                type="button"
              >
                EN
              </button>
            </div>
          </div>
          <div className="readiness-panel">
            <p className="readiness-label">{translate("readinessLabel")}</p>
            <p className="readiness-score">{readiness.score}%</p>
            <p className="readiness-state">{readinessLabel(readiness.label, language)}</p>
            <div className="readiness-progress" role="presentation">
              <span style={{ width: `${readiness.score}%` }} />
            </div>
            <div className="hero-metrics">
              <Metric
                title={translate("authMetric")}
                value={humanizeStatus(authStatus, language)}
              />
              <Metric title={translate("queueMetric")} value={String(pendingQueueCount)} />
              <Metric title={translate("goalMetric")} value={goalLabel(goal, language)} />
              <Metric
                title={translate("syncMetric")}
                value={humanizeStatus(syncStatus, language)}
              />
            </div>
          </div>
        </section>

        {releaseCompatibilityStatus === "upgrade_required" ? (
          <section className="status-banner critical">
            <strong>{translate("updateRequiredTitle")}</strong>
            <p>{translate("updateRequiredCopy")}</p>
          </section>
        ) : null}

        <section className="dashboard-grid">
          <article className="module-card">
            <SectionHeader
              title={translate("onboardingSectionTitle")}
              status={onboardingStatus}
              statusLabel={translate("onboardingStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <input
                placeholder={translate("displayNamePlaceholder")}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
              <div className="inline-inputs">
                <input
                  placeholder={translate("agePlaceholder")}
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                />
                <input
                  placeholder={translate("heightPlaceholder")}
                  value={heightCm}
                  onChange={(event) => setHeightCm(event.target.value)}
                />
              </div>
              <div className="inline-inputs">
                <input
                  placeholder={translate("weightPlaceholder")}
                  value={weightKg}
                  onChange={(event) => setWeightKg(event.target.value)}
                />
                <input
                  placeholder={translate("daysPerWeekPlaceholder")}
                  value={availableDaysPerWeek}
                  onChange={(event) => setAvailableDaysPerWeek(event.target.value)}
                />
              </div>
              <select value={goal} onChange={(event) => setGoal(event.target.value as Goal)}>
                <option value="fat_loss">fat_loss</option>
                <option value="recomposition">recomposition</option>
                <option value="muscle_gain">muscle_gain</option>
                <option value="habit">habit</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  checked={parQ1}
                  onChange={(event) => setParQ1(event.target.checked)}
                />
                {translate("parQQuestionOne")}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={parQ2}
                  onChange={(event) => setParQ2(event.target.checked)}
                />
                {translate("parQQuestionTwo")}
              </label>
              <button className="button primary" onClick={handleCompleteOnboarding} type="button">
                {translate("completeOnboarding")}
              </button>
            </div>
          </article>

          <article className="module-card">
            <SectionHeader
              title={translate("legalSectionTitle")}
              status={legalStatus}
              statusLabel={translate("legalStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <label>
                <input
                  type="checkbox"
                  checked={privacyPolicyAccepted}
                  onChange={(event) => setPrivacyPolicyAccepted(event.target.checked)}
                />
                {translate("acceptPrivacyPolicy")}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                />
                {translate("acceptTerms")}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={medicalDisclaimerAccepted}
                  onChange={(event) => setMedicalDisclaimerAccepted(event.target.checked)}
                />
                {translate("acceptMedicalDisclaimer")}
              </label>
              <div className="inline-inputs">
                <button className="button primary" onClick={handleSubmitLegalConsent} type="button">
                  {translate("saveConsent")}
                </button>
                <button className="button ghost" onClick={handleRequestDataDeletion} type="button">
                  {translate("requestDeletion")}
                </button>
              </div>
            </div>
          </article>

          <article className="module-card">
            <SectionHeader
              title={translate("trainingSectionTitle")}
              status={trainingStatus}
              statusLabel={translate("planStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <input
                  placeholder={translate("planNamePlaceholder")}
                  value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                />
                <button className="button primary" onClick={handleCreatePlan} type="button">
                  {translate("createPlan")}
                </button>
                <button className="button ghost" onClick={handleLoadPlans} type="button">
                  {translate("loadPlans")}
                </button>
              </div>
              <div className="choice-list">
                {plans.map((plan) => (
                  <label key={plan.id}>
                    <input
                      type="radio"
                      name="selected-plan"
                      checked={selectedPlanId === plan.id}
                      onChange={() => setSelectedPlanId(plan.id)}
                    />
                    {plan.name} ({plan.weeks} weeks)
                  </label>
                ))}
              </div>
              <div className="inline-inputs">
                <button className="button primary" onClick={handleLogWorkoutSession} type="button">
                  {translate("logWorkout")}
                </button>
                <button className="button ghost" onClick={handleLoadSessions} type="button">
                  {translate("loadSessions")}
                </button>
              </div>
              <StatLine
                label={translate("sessionStatusLabel")}
                value={sessionStatus}
                language={language}
              />
              <StatLine
                label={translate("sessionsLoadedLabel")}
                value={String(sessions.length)}
                language={language}
              />
            </div>
          </article>

          <article className="module-card">
            <SectionHeader
              title={translate("exerciseVideosTitle")}
              status={videoStatus}
              statusLabel={translate("videosStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <select
                  value={selectedExerciseForVideos}
                  onChange={(event) => setSelectedExerciseForVideos(event.target.value)}
                >
                  <option value="goblet-squat">goblet-squat</option>
                  <option value="bench-press">bench-press</option>
                </select>
                <select
                  value={videoLocale}
                  onChange={(event) => setVideoLocale(event.target.value)}
                >
                  <option value="es-ES">es-ES</option>
                  <option value="en-US">en-US</option>
                </select>
                <button className="button primary" onClick={handleLoadExerciseVideos} type="button">
                  {translate("loadVideos")}
                </button>
              </div>
              {exerciseVideos.length === 0 ? (
                <p className="empty-state">{translate("noVideosLoaded")}</p>
              ) : (
                <div className="video-grid">
                  {exerciseVideos.map((video) => (
                    <article key={video.id} className="video-item">
                      <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
                      <div className="video-body">
                        <strong>{video.title}</strong>
                        <p>{video.coach}</p>
                        <p>
                          {video.difficulty} · {Math.round(video.durationSeconds / 60)} min
                        </p>
                        <a href={video.videoUrl} target="_blank" rel="noreferrer">
                          {translate("openVideo")}
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </article>

          <article className="module-card">
            <SectionHeader
              title={translate("recommendationsTitle")}
              status={recommendationsStatus}
              statusLabel={translate("recommendationsStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <button className="button primary" onClick={handleLoadRecommendations} type="button">
                {translate("loadRecommendations")}
              </button>
              {recommendations.length === 0 ? (
                <p className="empty-state">{translate("noRecommendationsLoaded")}</p>
              ) : (
                <div className="recommendation-list">
                  {recommendations.map((recommendation) => (
                    <article key={recommendation.id} className="recommendation-item">
                      <div className="recommendation-head">
                        <strong>{recommendation.title}</strong>
                        <span
                          className={`status-pill status-${toStatusClass(
                            recommendation.priority
                          )}`}
                        >
                          {recommendation.priority}
                        </span>
                      </div>
                      <p>{recommendation.rationale}</p>
                      <div className="recommendation-meta">
                        <span>{recommendation.category}</span>
                        <span>{recommendation.expectedImpact}</span>
                        <strong>{recommendation.actionLabel}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </article>

          <article className="module-card">
            <SectionHeader
              title={translate("nutritionTitle")}
              status={nutritionStatus}
              statusLabel={translate("nutritionStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <input
                placeholder={translate("datePlaceholder")}
                value={nutritionDate}
                onChange={(event) => setNutritionDate(event.target.value)}
              />
              <div className="inline-inputs">
                <input
                  placeholder={translate("caloriesPlaceholder")}
                  value={calories}
                  onChange={(event) => setCalories(event.target.value)}
                />
                <input
                  placeholder={translate("proteinPlaceholder")}
                  value={proteinGrams}
                  onChange={(event) => setProteinGrams(event.target.value)}
                />
              </div>
              <div className="inline-inputs">
                <input
                  placeholder={translate("carbsPlaceholder")}
                  value={carbsGrams}
                  onChange={(event) => setCarbsGrams(event.target.value)}
                />
                <input
                  placeholder={translate("fatsPlaceholder")}
                  value={fatsGrams}
                  onChange={(event) => setFatsGrams(event.target.value)}
                />
              </div>
              <div className="inline-inputs">
                <button className="button primary" onClick={handleCreateNutritionLog} type="button">
                  {translate("saveNutritionLog")}
                </button>
                <button className="button ghost" onClick={handleLoadNutritionLogs} type="button">
                  {translate("loadLogs")}
                </button>
              </div>
              <StatLine
                label={translate("logsLoadedLabel")}
                value={String(nutritionLogs.length)}
                language={language}
              />
            </div>
          </article>

          <article className="module-card">
            <SectionHeader
              title={translate("progressTitle")}
              status={progressStatus}
              statusLabel={translate("progressStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <button className="button primary" onClick={handleLoadProgressSummary} type="button">
                {translate("loadProgressSummary")}
              </button>
              {progressSummary === null ? (
                <p className="empty-state">{translate("noSummaryLoaded")}</p>
              ) : (
                <>
                  <div className="metric-grid">
                    <Metric
                      title={translate("workoutsMetric")}
                      value={String(progressSummary.workoutSessionsCount)}
                    />
                    <Metric
                      title={translate("minutesMetric")}
                      value={String(progressSummary.totalTrainingMinutes)}
                    />
                    <Metric
                      title={translate("setsMetric")}
                      value={String(progressSummary.totalCompletedSets)}
                    />
                    <Metric
                      title={translate("nutritionMetric")}
                      value={String(progressSummary.nutritionLogsCount)}
                    />
                    <Metric
                      title={translate("avgCaloriesMetric")}
                      value={String(progressSummary.averageCalories)}
                    />
                    <Metric
                      title={translate("avgProteinMetric")}
                      value={String(progressSummary.averageProteinGrams)}
                    />
                  </div>
                  <div className="history-list">
                    {progressSummary.history.map((entry) => (
                      <article key={entry.date} className="history-item">
                        <strong>{entry.date}</strong>
                        <div className="history-values">
                          <span>
                            {translate("historySessionsLabel")} {entry.workoutSessions}
                          </span>
                          <span>
                            {translate("historyMinutesLabel")} {entry.trainingMinutes}
                          </span>
                          <span>
                            {translate("historySetsLabel")} {entry.completedSets}
                          </span>
                          <span>
                            {translate("historyCaloriesLabel")} {entry.calories ?? "-"}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </article>

          <article className="module-card">
            <SectionHeader
              title={translate("offlineSyncTitle")}
              status={syncStatus}
              statusLabel={translate("syncStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <button className="button primary" onClick={handleSyncOfflineQueue} type="button">
                  {translate("syncQueue")}
                </button>
                <button className="button ghost" onClick={() => void refreshPendingQueue()} type="button">
                  {translate("refreshQueue")}
                </button>
              </div>
              <StatLine
                label={translate("pendingActionsLabel")}
                value={String(pendingQueueCount)}
                language={language}
              />
              <StatLine
                label={translate("rejectedLastSyncLabel")}
                value={String(lastSyncRejectedCount)}
                language={language}
              />
            </div>
          </article>

          <article className="module-card">
            <SectionHeader
              title={translate("observabilityTitle")}
              status={observabilityStatus}
              statusLabel={translate("observabilityStatusLabel")}
              language={language}
            />
            <div className="form-grid">
              <div className="inline-inputs">
                <button className="button primary" onClick={handleTrackAnalyticsEvent} type="button">
                  {translate("trackEvent")}
                </button>
                <button className="button ghost" onClick={handleReportDemoCrash} type="button">
                  {translate("reportCrash")}
                </button>
                <button className="button ghost" onClick={handleLoadObservabilityData} type="button">
                  {translate("loadData")}
                </button>
              </div>
              <StatLine
                label={translate("analyticsEventsLabel")}
                value={String(analyticsEvents.length)}
                language={language}
              />
              <StatLine
                label={translate("crashReportsLabel")}
                value={String(crashReports.length)}
                language={language}
              />
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

type SectionHeaderProps = {
  title: string;
  statusLabel: string;
  status: string;
  language: AppLanguage;
};

function SectionHeader({ title, statusLabel, status, language }: SectionHeaderProps) {
  return (
    <header className="module-header">
      <h2>{title}</h2>
      <p>
        {statusLabel}:{" "}
        <span className={`status-pill status-${toStatusClass(status)}`}>
          {toHumanStatus(status, language)}
        </span>
      </p>
    </header>
  );
}

type MetricProps = {
  title: string;
  value: string;
};

function Metric({ title, value }: MetricProps) {
  return (
    <article className="metric-item">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
}

type StatLineProps = {
  label: string;
  value: string;
  language: AppLanguage;
};

function StatLine({ label, value, language }: StatLineProps) {
  return (
    <p className="stat-line">
      <span>{label}</span>
      <strong>{toHumanStatus(value, language)}</strong>
    </p>
  );
}

function toHumanStatus(status: string, language: AppLanguage): string {
  return humanizeStatus(status, language);
}

function toStatusClass(status: string): string {
  if (status === "high") {
    return "critical";
  }
  if (status === "medium") {
    return "warning";
  }
  if (status === "low") {
    return "positive";
  }
  if (status.includes("error") || status.includes("required")) {
    return "critical";
  }
  if (status.includes("saved") || status.includes("loaded") || status.includes("signed_in")) {
    return "positive";
  }
  if (status.includes("queued")) {
    return "warning";
  }
  return "neutral";
}

function readLanguagePreference(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const storedLanguage = window.localStorage.getItem(languageStorageKey);
  if (storedLanguage !== null) {
    return storedLanguage;
  }
  return window.navigator.language;
}

function persistLanguagePreference(language: AppLanguage): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(languageStorageKey, language);
}
