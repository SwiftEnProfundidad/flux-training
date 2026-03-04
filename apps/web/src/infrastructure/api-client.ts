import type { AccessRole, AuthSession } from "@flux/contracts";

type EnvMap = Record<string, string | undefined>;
type ApiErrorPayload = {
  error?: unknown;
  correlationId?: unknown;
  retryable?: unknown;
  statusCode?: unknown;
};

const defaultWebVersion = "0.1.0";
const clientUpdateRequiredErrorCode = "client_update_required";
let activeApiSession: Pick<AuthSession, "token" | "userId"> | null = null;
let activeApiAccessRole: AccessRole | null = null;

export class ApiClientError extends Error {
  readonly code: string;
  readonly correlationId: string | null;
  readonly retryable: boolean | null;
  readonly statusCode: number;

  constructor(input: {
    code: string;
    statusCode: number;
    correlationId?: string | null;
    retryable?: boolean | null;
  }) {
    super(input.code);
    this.name = "ApiClientError";
    this.code = input.code;
    this.statusCode = input.statusCode;
    this.correlationId = input.correlationId ?? null;
    this.retryable = input.retryable ?? null;
  }
}

function readDefaultEnv(): EnvMap {
  const importMeta = import.meta as ImportMeta & { env?: EnvMap };
  return importMeta.env ?? {};
}

export function resolveWebClientVersion(env: EnvMap = readDefaultEnv()): string {
  const rawVersion = String(env.VITE_APP_VERSION ?? "").trim();
  if (rawVersion.length === 0) {
    return defaultWebVersion;
  }
  return rawVersion;
}

export function createApiHeaders(env: EnvMap = readDefaultEnv(), useJson = false): Record<string, string> {
  const headers: Record<string, string> = {
    "x-flux-client-platform": "web",
    "x-flux-client-version": resolveWebClientVersion(env)
  };
  if (activeApiSession !== null) {
    headers.Authorization = `Bearer ${activeApiSession.token}`;
  }
  if (activeApiAccessRole !== null) {
    headers["x-flux-access-role"] = activeApiAccessRole;
  }
  if (useJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

export function setApiAuthSession(session: AuthSession | null): void {
  if (session === null) {
    activeApiSession = null;
    return;
  }
  activeApiSession = {
    token: session.token,
    userId: session.userId
  };
}

export function getApiAuthUserId(): string | undefined {
  return activeApiSession?.userId;
}

export function setApiAccessRole(role: AccessRole | null): void {
  activeApiAccessRole = role;
}

async function readApiErrorPayload(response: Response): Promise<ApiErrorPayload | null> {
  const contentType = response.headers.get("Content-Type");
  if (contentType === null || contentType.includes("application/json") === false) {
    return null;
  }

  try {
    return (await response.clone().json()) as ApiErrorPayload;
  } catch {
    return null;
  }
}

export async function assertApiResponse(response: Response, fallbackErrorCode: string): Promise<void> {
  if (response.ok) {
    return;
  }

  const payload = await readApiErrorPayload(response);
  const errorCode =
    typeof payload?.error === "string" && payload.error.length > 0
      ? payload.error
      : fallbackErrorCode;
  const correlationId =
    typeof payload?.correlationId === "string" && payload.correlationId.length > 0
      ? payload.correlationId
      : null;
  const retryable =
    typeof payload?.retryable === "boolean"
      ? payload.retryable
      : response.status >= 500;
  const statusCode =
    typeof payload?.statusCode === "number" && Number.isFinite(payload.statusCode)
      ? payload.statusCode
      : response.status;

  throw new ApiClientError({
    code: errorCode,
    statusCode,
    correlationId,
    retryable
  });
}

export function isClientUpdateRequiredError(error: unknown): boolean {
  return (
    (error instanceof ApiClientError && error.code === clientUpdateRequiredErrorCode) ||
    (error instanceof Error && error.message === clientUpdateRequiredErrorCode)
  );
}
