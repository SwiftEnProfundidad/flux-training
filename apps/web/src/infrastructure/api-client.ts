type EnvMap = Record<string, string | undefined>;

const defaultWebVersion = "0.1.0";
const clientUpdateRequiredErrorCode = "client_update_required";

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
  if (useJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

async function readApiErrorCode(response: Response): Promise<string | null> {
  const contentType = response.headers.get("Content-Type");
  if (contentType === null || contentType.includes("application/json") === false) {
    return null;
  }

  try {
    const payload = (await response.clone().json()) as { error?: unknown };
    if (typeof payload.error === "string" && payload.error.length > 0) {
      return payload.error;
    }
  } catch {
    return null;
  }

  return null;
}

export async function assertApiResponse(response: Response, fallbackErrorCode: string): Promise<void> {
  if (response.ok) {
    return;
  }

  const apiErrorCode = await readApiErrorCode(response);
  throw new Error(apiErrorCode ?? fallbackErrorCode);
}

export function isClientUpdateRequiredError(error: unknown): boolean {
  return error instanceof Error && error.message === clientUpdateRequiredErrorCode;
}
