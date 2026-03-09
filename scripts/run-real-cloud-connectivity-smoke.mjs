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

function buildProbeCandidates(apiTarget) {
  const normalizedTarget = normalizeApiTarget(apiTarget);
  const candidates = [`${normalizedTarget}/createAuthSession`];

  try {
    const parsed = new URL(normalizedTarget);
    const directFunctionPath = `${parsed.origin}/createAuthSession`;
    if (candidates.includes(directFunctionPath) === false) {
      candidates.push(directFunctionPath);
    }
  } catch {
    // Keep only the normalized target candidate when URL parsing fails.
  }

  return {
    apiTarget: normalizedTarget,
    probeUrls: candidates,
  };
}

export async function runRealCloudConnectivitySmoke({
  rootDir,
  fetchImpl = fetch,
  now = () => new Date().toISOString(),
  runtimeEnvironment = process.env,
}) {
  const webEnvValues = readEnvFile(path.join(rootDir, "apps/web/.env.local"));
  const iosEnvValues = readEnvFile(path.join(rootDir, "apps/ios/.env.local"));
  const resolvedEnvironment = {
    ...iosEnvValues,
    ...webEnvValues,
    ...runtimeEnvironment,
  };
  const apiTarget =
    String(resolvedEnvironment.VITE_API_TARGET ?? "").trim() ||
    String(resolvedEnvironment.FLUX_BACKEND_BASE_URL ?? "").trim();

  if (apiTarget.length === 0) {
    return {
      status: "blocked-real-config",
      executedAt: now(),
      blockers: ["faltan endpoints reales: VITE_API_TARGET o FLUX_BACKEND_BASE_URL"],
    };
  }

  const { apiTarget: normalizedTarget, probeUrls } = buildProbeCandidates(apiTarget);
  const attempts = [];
  let lastFailure = null;

  for (const probeUrl of probeUrls) {
    try {
      const response = await fetchImpl(probeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      });

      attempts.push({
        probeUrl,
        statusCode: response.status,
      });

      if (response.status !== 404) {
        const payload = await response.json().catch(() => null);
        return {
          status: "ready",
          executedAt: now(),
          apiTarget: normalizedTarget,
          probeUrl,
          statusCode: response.status,
          payload,
          attempts,
        };
      }

      lastFailure = {
        status: "blocked-remote-target",
        stage: "backend-probe",
        executedAt: now(),
        apiTarget: normalizedTarget,
        probeUrl,
        statusCode: response.status,
        attempts,
      };
    } catch (error) {
      attempts.push({
        probeUrl,
        errorCode: error instanceof Error ? error.message : "unknown_error",
      });
      lastFailure = {
        status: "failed",
        stage: "backend-probe",
        executedAt: now(),
        apiTarget: normalizedTarget,
        probeUrl,
        errorCode: error instanceof Error ? error.message : "unknown_error",
        attempts,
      };
    }
  }

  return (
    lastFailure ?? {
      status: "failed",
      stage: "backend-probe",
      executedAt: now(),
      apiTarget: normalizedTarget,
      probeUrl: probeUrls[0],
      errorCode: "unknown_probe_failure",
      attempts,
    }
  );
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

  if (result.status === "failed" || result.status === "blocked-remote-target") {
    lines.push(`stage: ${result.stage}`);
    lines.push(`apiTarget: ${result.apiTarget}`);
    lines.push(`probeUrl: ${result.probeUrl}`);
    if (typeof result.statusCode === "number") {
      lines.push(`statusCode: ${result.statusCode}`);
    }
    if (typeof result.errorCode === "string") {
      lines.push(`errorCode: ${result.errorCode}`);
    }
    if (Array.isArray(result.attempts) && result.attempts.length > 0) {
      lines.push("attempts:");
      for (const attempt of result.attempts) {
        const suffix =
          typeof attempt.statusCode === "number"
            ? `statusCode=${attempt.statusCode}`
            : `errorCode=${attempt.errorCode}`;
        lines.push(`  - ${attempt.probeUrl} -> ${suffix}`);
      }
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
