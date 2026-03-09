import process from "node:process";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";
import path from "node:path";
import url from "node:url";

const execFile = promisify(execFileCallback);

function inferProjectId() {
  const webTarget = String(process.env.VITE_API_TARGET ?? "").trim();
  if (webTarget.length > 0) {
    const match = webTarget.match(/https:\/\/us-central1-([^.]+)\.cloudfunctions\.net/);
    if (match?.[1]) {
      return match[1];
    }
  }
  return "flux-training-mvp";
}

function parseProjects(stdout) {
  const payload = JSON.parse(stdout);
  return Array.isArray(payload.result) ? payload.result : [];
}

async function runFirebase(args, execFileImpl) {
  try {
    const result = await execFileImpl("npx", ["--yes", "firebase-tools", ...args]);
    return {
      ok: true,
      stdout: String(result.stdout ?? ""),
      stderr: String(result.stderr ?? ""),
    };
  } catch (error) {
    return {
      ok: false,
      stdout: String(error?.stdout ?? ""),
      stderr: String(error?.stderr ?? ""),
    };
  }
}

export async function checkCloudProjectAccess({
  projectId = inferProjectId(),
  execFileImpl = execFile,
  now = () => new Date().toISOString(),
} = {}) {
  const projectsList = await runFirebase(["projects:list", "--json"], execFileImpl);
  const projectListOutput = `${projectsList.stdout}\n${projectsList.stderr}`.trim();

  if (!projectsList.ok) {
    return {
      status: "blocked-provider-auth",
      executedAt: now(),
      projectId,
      errorCode: "firebase_projects_list_failed",
      output: projectListOutput,
    };
  }

  const projects = parseProjects(projectsList.stdout);
  const projectVisible = projects.some((project) => project.projectId === projectId);
  if (!projectVisible) {
    return {
      status: "blocked-project-access",
      executedAt: now(),
      projectId,
      visibleProjects: projects.map((project) => project.projectId),
      errorCode: "project_not_visible",
    };
  }

  const functionsList = await runFirebase(["functions:list", "--project", projectId, "--json"], execFileImpl);
  if (!functionsList.ok) {
    const output = `${functionsList.stdout}\n${functionsList.stderr}`.trim();
    const denied = /403|Permission|denied/i.test(output);
    const serviceDisabled = /SERVICE_DISABLED|Cloud Functions API has not been used|cloudfunctions\.googleapis\.com/i.test(
      output
    );
    return {
      status: serviceDisabled
        ? "blocked-cloud-functions-api-disabled"
        : denied
          ? "blocked-project-permissions"
          : "failed",
      executedAt: now(),
      projectId,
      errorCode: serviceDisabled
        ? "cloud_functions_api_disabled"
        : denied
          ? "functions_access_denied"
          : "functions_list_failed",
      output,
    };
  }

  return {
    status: "ready",
    executedAt: now(),
    projectId,
    visibleProjects: projects.map((project) => project.projectId),
  };
}

function formatHumanReadable(result) {
  const lines = [
    `status: ${result.status}`,
    `executedAt: ${result.executedAt}`,
    `projectId: ${result.projectId}`,
  ];

  if (Array.isArray(result.visibleProjects)) {
    lines.push(`visibleProjects: ${result.visibleProjects.join(",") || "-"}`);
  }
  if (typeof result.errorCode === "string") {
    lines.push(`errorCode: ${result.errorCode}`);
  }
  if (typeof result.output === "string" && result.output.length > 0) {
    lines.push(`output: ${result.output}`);
  }
  return `${lines.join("\n")}\n`;
}

async function runCli() {
  const result = await checkCloudProjectAccess();
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
