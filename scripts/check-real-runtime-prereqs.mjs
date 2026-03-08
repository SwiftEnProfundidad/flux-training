import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import url from "node:url";

const webRequiredKeys = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_API_TARGET",
];

const iosRequiredKeys = [
  "FLUX_BACKEND_BASE_URL",
  "FLUX_FIREBASE_WEB_API_KEY",
  "FLUX_IOS_CLIENT_VERSION",
];

const iosOptionalKeys = ["FLUX_APPLE_PROVIDER_TOKEN"];
const e2eRequiredKeys = ["FLUX_E2E_EMAIL", "FLUX_E2E_PASSWORD"];

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
    return { exists: false, values: {} };
  }

  return {
    exists: true,
    values: parseEnvContent(fs.readFileSync(filePath, "utf8")),
  };
}

function keyStatus(source, key) {
  return Boolean(source[key]);
}

export function evaluateRealRuntimePrereqs({
  rootDir,
  iosEnvironment = process.env,
  e2eEnvironment = process.env,
}) {
  const webEnvPath = path.join(rootDir, "apps/web/.env.local");
  const backendEnvPath = path.join(rootDir, "apps/backend/.env.local");
  const iosEnvPath = path.join(rootDir, "apps/ios/.env.local");
  const e2eEnvPath = path.join(rootDir, ".env.e2e.local");
  const webEnv = readEnvFile(webEnvPath);
  const backendEnv = readEnvFile(backendEnvPath);
  const iosEnv = readEnvFile(iosEnvPath);
  const e2eEnv = readEnvFile(e2eEnvPath);
  const resolvedIosEnvironment = {
    ...iosEnv.values,
    ...iosEnvironment,
  };
  const resolvedE2EEnvironment = {
    ...e2eEnv.values,
    ...e2eEnvironment,
  };

  const webMissingKeys = webRequiredKeys.filter((key) => !keyStatus(webEnv.values, key));
  const iosMissingKeys = iosRequiredKeys.filter((key) => !keyStatus(resolvedIosEnvironment, key));
  const iosOptionalMissingKeys = iosOptionalKeys.filter((key) => !keyStatus(resolvedIosEnvironment, key));
  const e2eMissingKeys = e2eRequiredKeys.filter((key) => !keyStatus(resolvedE2EEnvironment, key));

  const blockers = [];

  if (!webEnv.exists) {
    blockers.push("apps/web/.env.local ausente");
  }
  if (webMissingKeys.length > 0) {
    blockers.push(`faltan claves web reales: ${webMissingKeys.join(", ")}`);
  }
  if (iosMissingKeys.length > 0) {
    blockers.push(`faltan variables iOS en entorno/scheme: ${iosMissingKeys.join(", ")}`);
  }
  if (e2eMissingKeys.length > 0) {
    blockers.push(`faltan credenciales E2E reales: ${e2eMissingKeys.join(", ")}`);
  }

  const platformConfigStatus =
    webMissingKeys.length === 0 && iosMissingKeys.length === 0
      ? "ready"
      : "blocked-real-config";
  const testIdentityStatus =
    e2eMissingKeys.length === 0 ? "ready" : "blocked-real-user-credentials";
  const status =
    platformConfigStatus === "ready" && testIdentityStatus === "ready"
      ? "ready"
      : platformConfigStatus !== "ready"
        ? "blocked-real-config"
        : "blocked-real-user-credentials";

  return {
    status,
    platformConfigStatus,
    testIdentityStatus,
    rootDir,
    web: {
      envPath: webEnvPath,
      exists: webEnv.exists,
      required: webRequiredKeys.map((key) => ({
        key,
        present: keyStatus(webEnv.values, key),
      })),
    },
    backend: {
      envPath: backendEnvPath,
      exists: backendEnv.exists,
      note:
        "Para MVP real cloud no hace falta apps/backend/.env.local; el backend HTTP local del repo sigue siendo demo.",
    },
    ios: {
      envPath: iosEnvPath,
      envFileExists: iosEnv.exists,
      required: iosRequiredKeys.map((key) => ({
        key,
        present: keyStatus(resolvedIosEnvironment, key),
      })),
      optional: iosOptionalKeys.map((key) => ({
        key,
        present: keyStatus(resolvedIosEnvironment, key),
      })),
      optionalMissingKeys: iosOptionalMissingKeys,
    },
    e2e: {
      envPath: e2eEnvPath,
      envFileExists: e2eEnv.exists,
      required: e2eRequiredKeys.map((key) => ({
        key,
        present: keyStatus(resolvedE2EEnvironment, key),
      })),
    },
    blockers,
  };
}

function formatHumanReadable(result) {
  const lines = [];
  lines.push(`readiness: ${result.status}`);
  lines.push(`platformConfig: ${result.platformConfigStatus}`);
  lines.push(`testIdentity: ${result.testIdentityStatus}`);
  lines.push("");
  lines.push(`web env: ${result.web.exists ? "present" : "missing"} (${result.web.envPath})`);
  for (const item of result.web.required) {
    lines.push(`  - ${item.key}: ${item.present ? "present" : "missing"}`);
  }
  lines.push("");
  lines.push(`backend env: ${result.backend.exists ? "present" : "missing"} (${result.backend.envPath})`);
  lines.push(`  - note: ${result.backend.note}`);
  lines.push("");
  lines.push(`ios env: ${result.ios.envFileExists ? "present" : "missing"} (${result.ios.envPath})`);
  lines.push("ios scheme/environment:");
  for (const item of result.ios.required) {
    lines.push(`  - ${item.key}: ${item.present ? "present" : "missing"}`);
  }
  for (const item of result.ios.optional) {
    lines.push(`  - ${item.key}: ${item.present ? "present" : "missing"} (optional)`);
  }
  lines.push("");
  lines.push(`e2e env: ${result.e2e.envFileExists ? "present" : "missing"} (${result.e2e.envPath})`);
  for (const item of result.e2e.required) {
    lines.push(`  - ${item.key}: ${item.present ? "present" : "missing"}`);
  }
  lines.push("");
  if (result.blockers.length === 0) {
    lines.push("blockers: none");
  } else {
    lines.push("blockers:");
    for (const blocker of result.blockers) {
      lines.push(`  - ${blocker}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function runCli() {
  const args = new Set(process.argv.slice(2));
  const currentFile = url.fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const rootDir = path.resolve(currentDir, "..");
  const result = evaluateRealRuntimePrereqs({ rootDir });

  if (args.has("--json")) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  process.stdout.write(formatHumanReadable(result));
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);

if (isDirectExecution) {
  runCli();
}
