import path from "node:path";
import process from "node:process";
import url from "node:url";

import { checkProviderAuthSources } from "./check-provider-auth-sources.mjs";
import { checkProviderAuthReadiness } from "./check-provider-auth-readiness.mjs";
import { checkCloudProjectAccess } from "./check-cloud-project-access.mjs";
import { runRealCloudConnectivitySmoke } from "./run-real-cloud-connectivity-smoke.mjs";
import { runRealLoginSmoke } from "./run-real-login-smoke.mjs";

export async function runRealRuntimeDoctor({
  rootDir,
  now = () => new Date().toISOString(),
  checkSourcesImpl = checkProviderAuthSources,
  checkReadinessImpl = checkProviderAuthReadiness,
  checkProjectAccessImpl = checkCloudProjectAccess,
  runCloudSmokeImpl = runRealCloudConnectivitySmoke,
  runLoginSmokeImpl = runRealLoginSmoke,
} = {}) {
  const executedAt = now();
  const sources = await checkSourcesImpl();
  const providerAuth = await checkReadinessImpl();
  const projectAccess = await checkProjectAccessImpl();
  const cloudTarget = await runCloudSmokeImpl({ rootDir });
  const login = await runLoginSmokeImpl({ rootDir });

  const nextSteps = [];
  if (providerAuth.status !== "ready" && sources.status !== "sources-detected") {
    nextSteps.push("Autenticar Firebase/GCP o inyectar una fuente local valida de auth cloud.");
  }
  if (providerAuth.status !== "ready") {
    nextSteps.push("Ejecutar firebase login en esta maquina y revalidar provider auth.");
  }
  if (projectAccess.status === "blocked-project-access") {
    nextSteps.push("Usar una cuenta con acceso al proyecto real o confirmar el project id cloud correcto.");
  }
  if (projectAccess.status === "blocked-project-permissions") {
    nextSteps.push("Solicitar permisos sobre el proyecto cloud real para listar functions/hosting.");
  }
  if (cloudTarget.status !== "ready") {
    nextSteps.push("Confirmar la URL cloud real del backend antes de usar secrets E2E.");
  }
  if (login.status !== "ready") {
    if (login.status === "blocked-real-config") {
      nextSteps.push("Completar valores reales de Firebase/Auth en apps/web/.env.local y apps/ios/.env.local.");
    }
    if (login.status === "blocked-real-user-credentials") {
      nextSteps.push("Completar FLUX_E2E_EMAIL y FLUX_E2E_PASSWORD en .env.e2e.local.");
    }
  }

  const overallStatus =
    login.status === "ready"
      ? "ready"
      : providerAuth.status !== "ready"
        ? providerAuth.status
        : projectAccess.status !== "ready"
          ? projectAccess.status
          : sources.status === "no-provider-auth-sources"
        ? "blocked-provider-auth-sources"
        : cloudTarget.status === "blocked-remote-target"
            ? "blocked-remote-target"
            : login.status;

  return {
    status: overallStatus,
    executedAt,
    checks: {
      providerSources: sources,
      providerAuth,
      projectAccess,
      cloudTarget,
      realLogin: login,
    },
    nextSteps,
  };
}

function formatDoctor(result) {
  const lines = [
    `status: ${result.status}`,
    `executedAt: ${result.executedAt}`,
    `providerSources: ${result.checks.providerSources.status}`,
    `providerAuth: ${result.checks.providerAuth.status}`,
    `projectAccess: ${result.checks.projectAccess.status}`,
    `cloudTarget: ${result.checks.cloudTarget.status}`,
    `realLogin: ${result.checks.realLogin.status}`,
  ];

  const cloudTarget = result.checks.cloudTarget;
  if (cloudTarget.apiTarget) {
    lines.push(`apiTarget: ${cloudTarget.apiTarget}`);
  }

  if (result.nextSteps.length > 0) {
    lines.push("nextSteps:");
    for (const step of result.nextSteps) {
      lines.push(`  - ${step}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function runCli() {
  const currentFile = url.fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const rootDir = path.resolve(currentDir, "..");
  const result = await runRealRuntimeDoctor({ rootDir });
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  process.stdout.write(formatDoctor(result));
  if (result.status !== "ready") {
    process.exitCode = 1;
  }
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);

if (isDirectExecution) {
  await runCli();
}
