import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import url from "node:url";

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

function normalizeApiTarget(rawTarget) {
  return rawTarget.trim().replace(/\/$/, "");
}

export async function runRealCloudConnectivitySmoke({
  rootDir,
  fetchImpl = fetch,
  now = () => new Date().toISOString(),
}) {
  const webEnvValues = readEnvFile(path.join(rootDir, "apps/web/.env.local"));
  const iosEnvValues = readEnvFile(path.join(rootDir, "apps/ios/.env.local"));
  const apiTarget =
    String(webEnvValues.VITE_API_TARGET ?? "").trim() ||
    String(iosEnvValues.FLUX_BACKEND_BASE_URL ?? "").trim();

  if (apiTarget.length === 0) {
    return {
      status: "blocked-real-config",
      executedAt: now(),
      blockers: ["faltan endpoints reales: VITE_API_TARGET o FLUX_BACKEND_BASE_URL"],
    };
  }

  const normalizedTarget = normalizeApiTarget(apiTarget);
  const probeUrl = `${normalizedTarget}/createAuthSession`;

  try {
    const response = await fetchImpl(probeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.status === 404) {
      return {
        status: "failed",
        stage: "backend-probe",
        executedAt: now(),
        apiTarget: normalizedTarget,
        probeUrl,
        statusCode: response.status,
      };
    }

    const payload = await response.json().catch(() => null);
    return {
      status: "ready",
      executedAt: now(),
      apiTarget: normalizedTarget,
      probeUrl,
      statusCode: response.status,
      payload,
    };
  } catch (error) {
    return {
      status: "failed",
      stage: "backend-probe",
      executedAt: now(),
      apiTarget: normalizedTarget,
      probeUrl,
      errorCode: error instanceof Error ? error.message : "unknown_error",
    };
  }
}

function formatHumanReadable(result) {
  const lines = [`status: ${result.status}`, `executedAt: ${result.executedAt}`];

  if (result.status === "blocked-real-config") {
    lines.push("blockers:");
    for (const blocker of result.blockers) {
      lines.push(`  - ${blocker}`);
    }
    return `${lines.join("\n")}\n`;
  }

  if (result.status === "failed") {
    lines.push(`stage: ${result.stage}`);
    lines.push(`apiTarget: ${result.apiTarget}`);
    lines.push(`probeUrl: ${result.probeUrl}`);
    if (typeof result.statusCode === "number") {
      lines.push(`statusCode: ${result.statusCode}`);
    }
    if (typeof result.errorCode === "string") {
      lines.push(`errorCode: ${result.errorCode}`);
    }
    return `${lines.join("\n")}\n`;
  }

  lines.push(`apiTarget: ${result.apiTarget}`);
  lines.push(`probeUrl: ${result.probeUrl}`);
  lines.push(`statusCode: ${result.statusCode}`);
  lines.push(`payload: ${JSON.stringify(result.payload)}`);
  return `${lines.join("\n")}\n`;
}

function runCli() {
  const currentFile = url.fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const rootDir = path.resolve(currentDir, "..");
  runRealCloudConnectivitySmoke({ rootDir })
    .then((result) => {
      process.stdout.write(formatHumanReadable(result));
      if (result.status !== "ready") {
        process.exitCode = 1;
      }
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);

if (isDirectExecution) {
  runCli();
}
