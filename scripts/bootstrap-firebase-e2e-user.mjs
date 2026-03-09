import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import url from "node:url";
import { checkFirebaseAuthReadiness } from "./check-firebase-auth-readiness.mjs";

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

function maskEmail(email) {
  const normalized = String(email ?? "").trim();
  const atIndex = normalized.indexOf("@");
  if (atIndex <= 1) {
    return "***";
  }
  return `${normalized.slice(0, 2)}***${normalized.slice(atIndex)}`;
}

function formatResult(result) {
  const lines = [`status: ${result.status}`, `executedAt: ${result.executedAt}`];
  if (result.projectId) lines.push(`projectId: ${result.projectId}`);
  if (result.authDomain) lines.push(`authDomain: ${result.authDomain}`);
  if (result.email) lines.push(`email: ${result.email}`);
  if (result.stage) lines.push(`stage: ${result.stage}`);
  if (result.errorCode) lines.push(`errorCode: ${result.errorCode}`);
  if (result.userCreated != null) lines.push(`userCreated: ${result.userCreated}`);
  if (Array.isArray(result.blockers) && result.blockers.length > 0) {
    lines.push("blockers:");
    for (const blocker of result.blockers) {
      lines.push(`  - ${blocker}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

export async function bootstrapFirebaseE2EUser({
  rootDir,
  fetchImpl = fetch,
  now = () => new Date().toISOString(),
} = {}) {
  const readiness = await checkFirebaseAuthReadiness({ rootDir, fetchImpl, now });
  if (readiness.status !== "ready") {
    return readiness;
  }

  const e2eEnv = readEnvFile(path.join(rootDir, ".env.e2e.local"));
  const webEnv = readEnvFile(path.join(rootDir, "apps/web/.env.local"));

  const email = String(e2eEnv.FLUX_E2E_EMAIL ?? "").trim();
  const password = String(e2eEnv.FLUX_E2E_PASSWORD ?? "").trim();
  const apiKey = String(webEnv.VITE_FIREBASE_API_KEY ?? "").trim();

  const blockers = [];
  if (!email) blockers.push("falta FLUX_E2E_EMAIL en .env.e2e.local");
  if (!password) blockers.push("falta FLUX_E2E_PASSWORD en .env.e2e.local");

  if (blockers.length > 0) {
    return {
      status: "blocked-real-user-credentials",
      executedAt: now(),
      projectId: readiness.projectId,
      authDomain: readiness.authDomain,
      blockers,
    };
  }

  const signInUrl =
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`;
  const signUpUrl =
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(apiKey)}`;
  const authPayload = { email, password, returnSecureToken: true };

  const signInResponse = await fetchImpl(signInUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authPayload),
  });

  const signInResult = await signInResponse.json().catch(() => null);
  if (signInResponse.ok) {
    return {
      status: "ready-existing-user",
      executedAt: now(),
      projectId: readiness.projectId,
      authDomain: readiness.authDomain,
      email: maskEmail(email),
      userCreated: false,
    };
  }

  const signInError = typeof signInResult?.error?.message === "string" ? signInResult.error.message : "firebase_auth_failed";
  if (signInError !== "EMAIL_NOT_FOUND") {
    return {
      status: "failed",
      stage: "firebase-auth",
      executedAt: now(),
      projectId: readiness.projectId,
      authDomain: readiness.authDomain,
      email: maskEmail(email),
      errorCode: signInError,
    };
  }

  const signUpResponse = await fetchImpl(signUpUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authPayload),
  });
  const signUpResult = await signUpResponse.json().catch(() => null);

  if (!signUpResponse.ok) {
    return {
      status: "failed",
      stage: "firebase-signup",
      executedAt: now(),
      projectId: readiness.projectId,
      authDomain: readiness.authDomain,
      email: maskEmail(email),
      errorCode:
        typeof signUpResult?.error?.message === "string" ? signUpResult.error.message : "firebase_signup_failed",
    };
  }

  return {
    status: "ready-created-user",
    executedAt: now(),
    projectId: readiness.projectId,
    authDomain: readiness.authDomain,
    email: maskEmail(email),
    userCreated: true,
  };
}

async function runCli() {
  const currentFile = url.fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const rootDir = path.resolve(currentDir, "..");
  const result = await bootstrapFirebaseE2EUser({ rootDir });
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  process.stdout.write(formatResult(result));
  if (!String(result.status).startsWith("ready-")) {
    process.exitCode = 1;
  }
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);

if (isDirectExecution) {
  await runCli();
}
