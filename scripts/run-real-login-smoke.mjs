import path from "node:path";
import process from "node:process";
import url from "node:url";
import fs from "node:fs";
import { evaluateRealRuntimePrereqs } from "./check-real-runtime-prereqs.mjs";

function hasRequiredKey(entries, key) {
  return entries.some((entry) => entry.key === key && entry.present === true);
}

function maskEmail(email) {
  const normalized = email.trim();
  const atIndex = normalized.indexOf("@");
  if (atIndex <= 1) {
    return "***";
  }
  return `${normalized.slice(0, 2)}***${normalized.slice(atIndex)}`;
}

function normalizeApiTarget(rawTarget) {
  return rawTarget.trim().replace(/\/$/, "");
}

function parseEnvContent(content) {
  const values = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }
    const [key, ...rest] = line.split("=");
    values[key.trim()] = rest.join("=").trim();
  }
  return values;
}

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return parseEnvContent(fs.readFileSync(filePath, "utf8"));
}

export async function runRealLoginSmoke({
  rootDir,
  fetchImpl = fetch,
  now = () => new Date().toISOString(),
  iosEnvironment = process.env,
  e2eEnvironment = process.env,
}) {
  const webEnvValues = readEnvFile(path.join(rootDir, "apps/web/.env.local"));
  const e2eEnvValues = readEnvFile(path.join(rootDir, ".env.e2e.local"));
  const resolvedWebEnvironment = {
    ...webEnvValues,
    ...e2eEnvironment,
  };
  const resolvedE2EEnvironment = {
    ...e2eEnvValues,
    ...e2eEnvironment,
  };
  const readiness = evaluateRealRuntimePrereqs({
    rootDir,
    iosEnvironment,
    e2eEnvironment: resolvedE2EEnvironment,
  });

  const webReady =
    hasRequiredKey(readiness.web.required, "VITE_FIREBASE_API_KEY") &&
    hasRequiredKey(readiness.web.required, "VITE_FIREBASE_AUTH_DOMAIN") &&
    hasRequiredKey(readiness.web.required, "VITE_FIREBASE_PROJECT_ID") &&
    hasRequiredKey(readiness.web.required, "VITE_API_TARGET");
  const e2eReady =
    hasRequiredKey(readiness.e2e.required, "FLUX_E2E_EMAIL") &&
    hasRequiredKey(readiness.e2e.required, "FLUX_E2E_PASSWORD");

  if (!webReady || !e2eReady) {
    return {
      status: readiness.status,
      executedAt: now(),
      readiness,
      blockers: readiness.blockers,
    };
  }

  const apiKey = String(resolvedWebEnvironment.VITE_FIREBASE_API_KEY ?? "");
  const authDomain = String(resolvedWebEnvironment.VITE_FIREBASE_AUTH_DOMAIN ?? "");
  const projectId = String(resolvedWebEnvironment.VITE_FIREBASE_PROJECT_ID ?? "");
  const apiTarget = normalizeApiTarget(String(resolvedWebEnvironment.VITE_API_TARGET ?? ""));
  const email = String(resolvedE2EEnvironment.FLUX_E2E_EMAIL ?? "");
  const password = String(resolvedE2EEnvironment.FLUX_E2E_PASSWORD ?? "");

  const firebaseResponse = await fetchImpl(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    },
  );

  if (!firebaseResponse.ok) {
    const payload = await firebaseResponse.json().catch(() => null);
    return {
      status: "failed",
      stage: "firebase-auth",
      executedAt: now(),
      firebase: {
        authDomain,
        projectId,
        email: maskEmail(email),
      },
      errorCode:
        typeof payload?.error?.message === "string" ? payload.error.message : "firebase_auth_failed",
    };
  }

  const firebasePayload = await firebaseResponse.json();
  const providerToken = String(firebasePayload.idToken ?? "");
  if (providerToken.length === 0) {
    return {
      status: "failed",
      stage: "firebase-auth",
      executedAt: now(),
      firebase: {
        authDomain,
        projectId,
        email: maskEmail(email),
      },
      errorCode: "missing_id_token",
    };
  }

  const sessionResponse = await fetchImpl(`${apiTarget}/createAuthSession`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-flux-client-platform": "web",
      "x-flux-client-version": "0.1.0",
    },
    body: JSON.stringify({ providerToken }),
  });

  if (!sessionResponse.ok) {
    const payload = await sessionResponse.json().catch(() => null);
    return {
      status: "failed",
      stage: "backend-session",
      executedAt: now(),
      apiTarget,
      firebase: {
        authDomain,
        projectId,
        email: maskEmail(email),
      },
      errorCode:
        typeof payload?.error === "string" ? payload.error : "create_auth_session_failed",
    };
  }

  const sessionPayload = await sessionResponse.json();
  const session = sessionPayload?.session;
  const sessionToken = String(session?.token ?? "");
  const sessionUserId = String(session?.userId ?? "");

  if (sessionToken.length === 0 || sessionUserId.length === 0) {
    return {
      status: "failed",
      stage: "backend-session",
      executedAt: now(),
      apiTarget,
      firebase: {
        authDomain,
        projectId,
        email: maskEmail(email),
      },
      errorCode: "invalid_session_payload",
    };
  }

  const progressResponse = await fetchImpl(
    `${apiTarget}/getProgressSummary?userId=${encodeURIComponent(sessionUserId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "x-flux-client-platform": "web",
        "x-flux-client-version": "0.1.0",
      },
    },
  );

  if (!progressResponse.ok) {
    const payload = await progressResponse.json().catch(() => null);
    return {
      status: "failed",
      stage: "post-login-smoke",
      executedAt: now(),
      apiTarget,
      firebase: {
        authDomain,
        projectId,
        email: maskEmail(email),
      },
      userId: sessionUserId,
      errorCode:
        typeof payload?.error === "string" ? payload.error : "post_login_smoke_failed",
    };
  }

  const progressPayload = await progressResponse.json();

  return {
    status: "ready",
    executedAt: now(),
    apiTarget,
    firebase: {
      authDomain,
      projectId,
      email: maskEmail(email),
    },
    session: {
      userId: sessionUserId,
      sessionIdPresent: typeof session?.sessionId === "string" && session.sessionId.length > 0,
      expiresAtPresent: typeof session?.expiresAt === "string" && session.expiresAt.length > 0,
    },
    postLogin: {
      route: "getProgressSummary",
      hasSummary: progressPayload?.summary != null,
    },
  };
}

function formatHumanReadable(result) {
  const lines = [`status: ${result.status}`, `executedAt: ${result.executedAt}`];

  if (
    result.status === "blocked-real-config" ||
    result.status === "blocked-real-user-credentials"
  ) {
    lines.push("blockers:");
    for (const blocker of result.blockers) {
      lines.push(`  - ${blocker}`);
    }
    return `${lines.join("\n")}\n`;
  }

  if (result.status === "failed") {
    lines.push(`stage: ${result.stage}`);
    lines.push(`errorCode: ${result.errorCode}`);
    if (result.apiTarget) {
      lines.push(`apiTarget: ${result.apiTarget}`);
    }
    return `${lines.join("\n")}\n`;
  }

  lines.push(`apiTarget: ${result.apiTarget}`);
  lines.push(`user: ${result.firebase.email}`);
  lines.push(`session.userId: ${result.session.userId}`);
  lines.push(`session.sessionIdPresent: ${result.session.sessionIdPresent}`);
  lines.push(`session.expiresAtPresent: ${result.session.expiresAtPresent}`);
  lines.push(`postLogin.route: ${result.postLogin.route}`);
  lines.push(`postLogin.hasSummary: ${result.postLogin.hasSummary}`);
  return `${lines.join("\n")}\n`;
}

async function runCli() {
  const currentFile = url.fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const rootDir = path.resolve(currentDir, "..");
  const result = await runRealLoginSmoke({ rootDir });
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  process.stdout.write(formatHumanReadable(result));
  if (result.status !== "ready") {
    process.exitCode = 1;
  }
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);

if (isDirectExecution) {
  await runCli();
}
