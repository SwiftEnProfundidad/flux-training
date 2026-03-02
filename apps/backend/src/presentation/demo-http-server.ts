import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import {
  accessRoleSchema,
  analyticsEventSchema,
  authRecoveryRequestSchema,
  crashReportSchema,
  dataDeletionRequestSchema,
  goalSchema,
  legalConsentSubmissionSchema,
  nutritionLogSchema,
  syncQueueProcessInputSchema,
  trainingPlanSchema,
  workoutSessionInputSchema,
  type Goal
} from "@flux/contracts";
import {
  ClientUpdateRequiredError,
  EnsureSupportedClientVersionUseCase
} from "../application/ensure-supported-client-version";
import { createDemoApiRuntime } from "./demo-api-runtime";

type DemoHttpServerOptions = {
  host?: string;
  port?: number;
  webMinimumVersion?: string;
  iosMinimumVersion?: string;
};

export type DemoHttpServer = {
  host: string;
  port: number;
  baseUrl: string;
  stop(): Promise<void>;
};

type JsonPayload = Record<string, unknown>;

type RouteResult = {
  statusCode: number;
  payload: JsonPayload;
};

const routeMethodMap: Record<string, "GET" | "POST"> = {
  "/api/createAuthSession": "POST",
  "/api/requestAuthRecovery": "POST",
  "/api/createHealthScreening": "POST",
  "/api/completeOnboarding": "POST",
  "/api/createTrainingPlan": "POST",
  "/api/listTrainingPlans": "GET",
  "/api/createWorkoutSession": "POST",
  "/api/listWorkoutSessions": "GET",
  "/api/createNutritionLog": "POST",
  "/api/listNutritionLogs": "GET",
  "/api/getProgressSummary": "GET",
  "/api/processSyncQueue": "POST",
  "/api/createAnalyticsEvent": "POST",
  "/api/listAnalyticsEvents": "GET",
  "/api/createCrashReport": "POST",
  "/api/listCrashReports": "GET",
  "/api/recordLegalConsent": "POST",
  "/api/requestDataDeletion": "POST",
  "/api/listExerciseVideos": "GET",
  "/api/listAIRecommendations": "GET",
  "/api/listRoleCapabilities": "GET",
  "/api/listBillingInvoices": "GET",
  "/api/listSupportIncidents": "GET"
};

function mapDomainError(error: unknown, fallbackCode: string): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return fallbackCode;
}

function normalizeHeaderValue(value: string | string[] | undefined): string {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }
  return "";
}

function sendJson(response: ServerResponse, statusCode: number, payload: JsonPayload): void {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type,x-flux-client-platform,x-flux-client-version",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  if (chunks.length === 0) {
    return {};
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (raw.length === 0) {
    return {};
  }
  return JSON.parse(raw);
}

function parseNumberQuery(value: string | null): number {
  if (value === null || value.trim().length === 0) {
    return 0;
  }
  const numeric = Number(value);
  if (Number.isFinite(numeric) === false) {
    throw new Error("invalid_number_query");
  }
  return numeric;
}

function parseOptionalPositiveIntegerQuery(value: string | null): number | undefined {
  if (value === null || value.trim().length === 0) {
    return undefined;
  }
  const numeric = Number.parseInt(value, 10);
  if (Number.isNaN(numeric) || numeric <= 0) {
    throw new Error("invalid_limit_query");
  }
  return numeric;
}

function parseOptionalDateQuery(value: string | null): string | undefined {
  if (value === null || value.trim().length === 0) {
    return undefined;
  }
  const normalized = value.trim();
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(normalized);
  const isDateTime = Number.isNaN(Date.parse(normalized)) === false;
  if (isDateOnly || isDateTime) {
    return normalized;
  }
  throw new Error("invalid_date_query");
}

function parseOptionalEnumQuery<T extends string>(
  value: string | null,
  validValues: readonly T[]
): T | undefined {
  if (value === null || value.trim().length === 0) {
    return undefined;
  }
  const normalized = value.trim() as T;
  if (validValues.includes(normalized)) {
    return normalized;
  }
  throw new Error("invalid_enum_query");
}

function parseGoal(value: string | null): Goal {
  return goalSchema.parse(value ?? "");
}

function createUnsupportedClientVersionGuard(options: DemoHttpServerOptions) {
  const useCase = new EnsureSupportedClientVersionUseCase({
    webMinimumVersion: options.webMinimumVersion ?? "0.1.0",
    iosMinimumVersion: options.iosMinimumVersion ?? "0.1.0"
  });

  return (request: IncomingMessage): RouteResult | null => {
    try {
      useCase.execute({
        platform: normalizeHeaderValue(request.headers["x-flux-client-platform"]),
        clientVersion: normalizeHeaderValue(request.headers["x-flux-client-version"])
      });
      return null;
    } catch (error) {
      if (error instanceof ClientUpdateRequiredError) {
        return {
          statusCode: 426,
          payload: {
            error: error.code,
            platform: error.platform,
            minimumVersion: error.minimumVersion
          }
        };
      }
      return { statusCode: 400, payload: { error: "invalid_client_version" } };
    }
  };
}

export async function startDemoHttpServer(
  options: DemoHttpServerOptions = {}
): Promise<DemoHttpServer> {
  const runtime = createDemoApiRuntime();
  const guardUnsupportedClientVersion = createUnsupportedClientVersionGuard(options);
  const host = options.host ?? "127.0.0.1";
  const requestedPort = options.port ?? Number(process.env.FLUX_DEMO_API_PORT ?? "8787");

  const server = createServer(async (request, response) => {
    if (request.method === "OPTIONS") {
      sendJson(response, 204, {});
      return;
    }

    const method = request.method ?? "GET";
    const url = new URL(request.url ?? "/", "http://localhost");

    if (url.pathname === "/api/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (url.pathname.startsWith("/api/") === false) {
      sendJson(response, 404, { error: "route_not_found" });
      return;
    }

    const unsupportedClientResult = guardUnsupportedClientVersion(request);
    if (unsupportedClientResult !== null) {
      sendJson(response, unsupportedClientResult.statusCode, unsupportedClientResult.payload);
      return;
    }

    try {
      const result = await routeApiRequest(method, url, request, runtime);
      sendJson(response, result.statusCode, result.payload);
    } catch {
      sendJson(response, 500, { error: "internal_error" });
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(requestedPort, host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("invalid_demo_server_address");
  }

  return {
    host,
    port: address.port,
    baseUrl: `http://${host}:${address.port}`,
    stop: () => stopServer(server)
  };
}

function stopServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error !== undefined && error !== null) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function routeApiRequest(
  method: string,
  url: URL,
  request: IncomingMessage,
  runtime: ReturnType<typeof createDemoApiRuntime>
): Promise<RouteResult> {
  const expectedMethod = routeMethodMap[url.pathname];
  if (expectedMethod !== undefined && expectedMethod !== method) {
    return { statusCode: 405, payload: { error: "method_not_allowed" } };
  }

  if (method === "POST" && url.pathname === "/api/createAuthSession") {
    try {
      const body = (await readJsonBody(request)) as { providerToken?: unknown };
      const providerToken = String(body.providerToken ?? "").trim();
      if (providerToken.length === 0) {
        return { statusCode: 400, payload: { error: "missing_provider_token" } };
      }
      const session = await runtime.createAuthSession(providerToken);
      return { statusCode: 201, payload: { session } };
    } catch {
      return { statusCode: 401, payload: { error: "invalid_provider_token" } };
    }
  }

  if (method === "POST" && url.pathname === "/api/requestAuthRecovery") {
    try {
      const payload = authRecoveryRequestSchema.parse(await readJsonBody(request));
      const result = await runtime.requestAuthRecovery(payload);
      return { statusCode: 201, payload: { recovery: result } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_auth_recovery_payload") }
      };
    }
  }

  if (method === "POST" && url.pathname === "/api/createHealthScreening") {
    try {
      const body = (await readJsonBody(request)) as {
        userId?: unknown;
        onboardingProfile?: unknown;
        responses?: unknown;
      };
      const screening = await runtime.createHealthScreening({
        userId: String(body.userId ?? ""),
        onboardingProfile: body.onboardingProfile as {
          displayName: string;
          age: number;
          heightCm: number;
          weightKg: number;
          availableDaysPerWeek: number;
          equipment: string[];
          injuries: string[];
        },
        responses: body.responses as Array<{ questionId: string; answer: boolean }>
      });
      return { statusCode: 201, payload: { screening } };
    } catch {
      return { statusCode: 400, payload: { error: "invalid_health_screening_payload" } };
    }
  }

  if (method === "POST" && url.pathname === "/api/completeOnboarding") {
    try {
      const result = await runtime.completeOnboarding(await readJsonBody(request));
      return { statusCode: 201, payload: { result } };
    } catch {
      return { statusCode: 400, payload: { error: "invalid_onboarding_payload" } };
    }
  }

  if (method === "POST" && url.pathname === "/api/createTrainingPlan") {
    try {
      const payload = trainingPlanSchema
        .omit({ createdAt: true })
        .parse(await readJsonBody(request));
      const plan = await runtime.createTrainingPlan(payload);
      return { statusCode: 201, payload: { plan } };
    } catch {
      return { statusCode: 400, payload: { error: "invalid_training_plan_payload" } };
    }
  }

  if (method === "GET" && url.pathname === "/api/listTrainingPlans") {
    try {
      const userId = String(url.searchParams.get("userId") ?? "");
      const plans = await runtime.listTrainingPlans(userId);
      return { statusCode: 200, payload: { plans } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_list_training_plans_payload") }
      };
    }
  }

  if (method === "POST" && url.pathname === "/api/createWorkoutSession") {
    try {
      const payload = workoutSessionInputSchema.parse(await readJsonBody(request));
      const createdSession = await runtime.createWorkoutSession(payload);
      return { statusCode: 201, payload: { payload: createdSession } };
    } catch {
      return { statusCode: 400, payload: { error: "invalid_workout_session_payload" } };
    }
  }

  if (method === "GET" && url.pathname === "/api/listWorkoutSessions") {
    try {
      const userId = String(url.searchParams.get("userId") ?? "");
      const rawPlanId = url.searchParams.get("planId");
      const sessions = await runtime.listWorkoutSessions(userId, rawPlanId ?? undefined, {
        fromDate: parseOptionalDateQuery(url.searchParams.get("fromDate")),
        toDate: parseOptionalDateQuery(url.searchParams.get("toDate")),
        limit: parseOptionalPositiveIntegerQuery(url.searchParams.get("limit"))
      });
      return { statusCode: 200, payload: { sessions } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_list_workout_sessions_payload") }
      };
    }
  }

  if (method === "POST" && url.pathname === "/api/createNutritionLog") {
    try {
      const log = nutritionLogSchema.parse(await readJsonBody(request));
      const createdLog = await runtime.createNutritionLog(log);
      return { statusCode: 201, payload: { log: createdLog } };
    } catch {
      return { statusCode: 400, payload: { error: "invalid_nutrition_log_payload" } };
    }
  }

  if (method === "GET" && url.pathname === "/api/listNutritionLogs") {
    try {
      const userId = String(url.searchParams.get("userId") ?? "");
      const logs = await runtime.listNutritionLogs(userId, {
        fromDate: parseOptionalDateQuery(url.searchParams.get("fromDate")),
        toDate: parseOptionalDateQuery(url.searchParams.get("toDate")),
        limit: parseOptionalPositiveIntegerQuery(url.searchParams.get("limit"))
      });
      return { statusCode: 200, payload: { logs } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_list_nutrition_logs_payload") }
      };
    }
  }

  if (method === "GET" && url.pathname === "/api/getProgressSummary") {
    try {
      const userId = String(url.searchParams.get("userId") ?? "");
      const summary = await runtime.getProgressSummary(
        userId,
        parseOptionalDateQuery(url.searchParams.get("generatedAt"))
      );
      return { statusCode: 200, payload: { summary } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_progress_summary_payload") }
      };
    }
  }

  if (method === "POST" && url.pathname === "/api/processSyncQueue") {
    try {
      const payload = syncQueueProcessInputSchema.parse(await readJsonBody(request));
      const result = await runtime.processSyncQueue(payload);
      return { statusCode: 200, payload: { result } };
    } catch {
      return {
        statusCode: 400,
        payload: { error: "invalid_process_sync_queue_payload" }
      };
    }
  }

  if (method === "POST" && url.pathname === "/api/createAnalyticsEvent") {
    try {
      const event = analyticsEventSchema.parse(await readJsonBody(request));
      const createdEvent = await runtime.createAnalyticsEvent(event);
      return { statusCode: 201, payload: { event: createdEvent } };
    } catch {
      return { statusCode: 400, payload: { error: "invalid_analytics_event_payload" } };
    }
  }

  if (method === "GET" && url.pathname === "/api/listAnalyticsEvents") {
    try {
      const userId = String(url.searchParams.get("userId") ?? "");
      const sourceFilter = parseOptionalEnumQuery(
        url.searchParams.get("source"),
        ["web", "ios", "backend"] as const
      );
      const domainFilter = url.searchParams.get("domain")?.trim().toLowerCase() ?? "";
      const queryFilter = url.searchParams.get("query")?.trim().toLowerCase() ?? "";
      const limit = parseOptionalPositiveIntegerQuery(url.searchParams.get("limit"));
      const events = await runtime.listAnalyticsEvents(userId);
      const eventsFilteredBySource =
        sourceFilter === undefined
          ? events
          : events.filter((event) => event.source === sourceFilter);
      const eventsFilteredByDomain =
        domainFilter.length === 0
          ? eventsFilteredBySource
          : eventsFilteredBySource.filter((event) =>
              String(event.attributes.domain ?? "").toLowerCase().includes(domainFilter)
            );
      const eventsFilteredByQuery =
        queryFilter.length === 0
          ? eventsFilteredByDomain
          : eventsFilteredByDomain.filter((event) => {
              const reason = String(event.attributes.reason ?? "").toLowerCase();
              const correlationId = String(event.attributes.correlationId ?? "").toLowerCase();
              return (
                event.name.toLowerCase().includes(queryFilter) ||
                reason.includes(queryFilter) ||
                correlationId.includes(queryFilter)
              );
            });
      const payloadEvents =
        limit === undefined ? eventsFilteredByQuery : eventsFilteredByQuery.slice(0, limit);
      return { statusCode: 200, payload: { events: payloadEvents } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_list_analytics_events_payload") }
      };
    }
  }

  if (method === "POST" && url.pathname === "/api/createCrashReport") {
    try {
      const report = crashReportSchema.parse(await readJsonBody(request));
      const createdReport = await runtime.createCrashReport(report);
      return { statusCode: 201, payload: { report: createdReport } };
    } catch {
      return { statusCode: 400, payload: { error: "invalid_crash_report_payload" } };
    }
  }

  if (method === "GET" && url.pathname === "/api/listCrashReports") {
    try {
      const userId = String(url.searchParams.get("userId") ?? "");
      const sourceFilter = parseOptionalEnumQuery(
        url.searchParams.get("source"),
        ["web", "ios", "backend"] as const
      );
      const severityFilter = parseOptionalEnumQuery(
        url.searchParams.get("severity"),
        ["warning", "fatal"] as const
      );
      const queryFilter = url.searchParams.get("query")?.trim().toLowerCase() ?? "";
      const limit = parseOptionalPositiveIntegerQuery(url.searchParams.get("limit"));
      const reports = await runtime.listCrashReports(userId);
      const reportsFilteredBySource =
        sourceFilter === undefined
          ? reports
          : reports.filter((report) => report.source === sourceFilter);
      const reportsFilteredBySeverity =
        severityFilter === undefined
          ? reportsFilteredBySource
          : reportsFilteredBySource.filter((report) => report.severity === severityFilter);
      const reportsFilteredByQuery =
        queryFilter.length === 0
          ? reportsFilteredBySeverity
          : reportsFilteredBySeverity.filter((report) => {
              const stackTrace = (report.stackTrace ?? "").toLowerCase();
              return (
                report.message.toLowerCase().includes(queryFilter) ||
                stackTrace.includes(queryFilter)
              );
            });
      const payloadReports =
        limit === undefined ? reportsFilteredByQuery : reportsFilteredByQuery.slice(0, limit);
      return { statusCode: 200, payload: { reports: payloadReports } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_list_crash_reports_payload") }
      };
    }
  }

  if (method === "POST" && url.pathname === "/api/recordLegalConsent") {
    try {
      const consentInput = legalConsentSubmissionSchema.parse(await readJsonBody(request));
      const consent = await runtime.recordLegalConsent(consentInput);
      return { statusCode: 201, payload: { consent } };
    } catch (error) {
      if (error instanceof Error && error.message === "legal_consent_incomplete") {
        return { statusCode: 400, payload: { error: "legal_consent_incomplete" } };
      }
      return { statusCode: 400, payload: { error: "invalid_legal_consent_payload" } };
    }
  }

  if (method === "POST" && url.pathname === "/api/requestDataDeletion") {
    try {
      const deletionRequestInput = dataDeletionRequestSchema.parse(await readJsonBody(request));
      const deletionRequest = await runtime.requestDataDeletion(deletionRequestInput);
      return { statusCode: 201, payload: { request: deletionRequest } };
    } catch {
      return {
        statusCode: 400,
        payload: { error: "invalid_data_deletion_request_payload" }
      };
    }
  }

  if (method === "GET" && url.pathname === "/api/listExerciseVideos") {
    try {
      const videos = await runtime.listExerciseVideos({
        userId: String(url.searchParams.get("userId") ?? ""),
        exerciseId: String(url.searchParams.get("exerciseId") ?? ""),
        locale: String(url.searchParams.get("locale") ?? "")
      });
      return { statusCode: 200, payload: { videos } };
    } catch {
      return {
        statusCode: 400,
        payload: { error: "invalid_list_exercise_videos_payload" }
      };
    }
  }

  if (method === "GET" && url.pathname === "/api/listAIRecommendations") {
    try {
      const recommendations = await runtime.listAIRecommendations({
        userId: String(url.searchParams.get("userId") ?? ""),
        goal: parseGoal(url.searchParams.get("goal")),
        pendingQueueCount: parseNumberQuery(url.searchParams.get("pendingQueueCount")),
        daysSinceLastWorkout: parseNumberQuery(url.searchParams.get("daysSinceLastWorkout")),
        recentCompletionRate: parseNumberQuery(url.searchParams.get("recentCompletionRate")),
        locale: String(url.searchParams.get("locale") ?? "")
      });
      return { statusCode: 200, payload: { recommendations } };
    } catch {
      return {
        statusCode: 400,
        payload: { error: "invalid_list_ai_recommendations_payload" }
      };
    }
  }

  if (method === "GET" && url.pathname === "/api/listRoleCapabilities") {
    try {
      const role = accessRoleSchema.parse(String(url.searchParams.get("role") ?? "athlete"));
      const capabilities = await runtime.listRoleCapabilities(role);
      return { statusCode: 200, payload: { capabilities } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_role_capabilities_payload") }
      };
    }
  }

  if (method === "GET" && url.pathname === "/api/listBillingInvoices") {
    try {
      const userId = String(url.searchParams.get("userId") ?? "");
      const invoices = await runtime.listBillingInvoices(userId);
      return { statusCode: 200, payload: { invoices } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_list_billing_invoices_payload") }
      };
    }
  }

  if (method === "GET" && url.pathname === "/api/listSupportIncidents") {
    try {
      const userId = String(url.searchParams.get("userId") ?? "");
      const incidents = await runtime.listSupportIncidents(userId);
      return { statusCode: 200, payload: { incidents } };
    } catch (error) {
      return {
        statusCode: 400,
        payload: { error: mapDomainError(error, "invalid_list_support_incidents_payload") }
      };
    }
  }

  return { statusCode: 404, payload: { error: "route_not_found" } };
}

async function startFromCli(): Promise<void> {
  const server = await startDemoHttpServer();
  process.stdout.write(`[flux-demo-api] listening on ${server.baseUrl}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void startFromCli();
}
