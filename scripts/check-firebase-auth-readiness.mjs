import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import url from "node:url";

function parseEnvContent(content) {
  const values = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    values[key.trim()] = rest.join("=").trim();
  }
  return values;
}

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, values: {} };
  }
  return { exists: true, values: parseEnvContent(fs.readFileSync(filePath, "utf8")) };
}

export async function checkFirebaseAuthReadiness({
  rootDir,
  fetchImpl = fetch,
  now = () => new Date().toISOString(),
} = {}) {
  const webEnv = readEnvFile(path.join(rootDir, "apps/web/.env.local"));
  const apiKey = String(webEnv.values.VITE_FIREBASE_API_KEY ?? "").trim();
  const authDomain = String(webEnv.values.VITE_FIREBASE_AUTH_DOMAIN ?? "").trim();
  const projectId = String(webEnv.values.VITE_FIREBASE_PROJECT_ID ?? "").trim();

  if (!apiKey || !authDomain || !projectId) {
    return {
      status: "blocked-real-config",
      executedAt: now(),
      errorCode: "firebase_web_config_missing",
      authDomain,
      projectId,
    };
  }

  const response = await fetchImpl(
    `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "probe@example.com", continueUri: "http://localhost" }),
    },
  );

  const payload = await response.json().catch(() => null);
  const errorMessage = typeof payload?.error?.message === "string" ? payload.error.message : null;

  if (!response.ok && errorMessage === "CONFIGURATION_NOT_FOUND") {
    return {
      status: "blocked-firebase-auth-configuration",
      executedAt: now(),
      authDomain,
      projectId,
      errorCode: errorMessage,
    };
  }

  if (!response.ok) {
    return {
      status: "failed",
      executedAt: now(),
      authDomain,
      projectId,
      errorCode: errorMessage ?? `http_${response.status}`,
    };
  }

  return {
    status: "ready",
    executedAt: now(),
    authDomain,
    projectId,
  };
}

function format(result) {
  const lines = [
    `status: ${result.status}`,
    `executedAt: ${result.executedAt}`,
  ];
  if (result.projectId) lines.push(`projectId: ${result.projectId}`);
  if (result.authDomain) lines.push(`authDomain: ${result.authDomain}`);
  if (result.errorCode) lines.push(`errorCode: ${result.errorCode}`);
  return `${lines.join("\n")}\n`;
}

async function runCli() {
  const currentFile = url.fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const rootDir = path.resolve(currentDir, "..");
  const result = await checkFirebaseAuthReadiness({ rootDir });
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  process.stdout.write(format(result));
  if (result.status !== "ready") process.exitCode = 1;
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);
if (isDirectExecution) {
  await runCli();
}
