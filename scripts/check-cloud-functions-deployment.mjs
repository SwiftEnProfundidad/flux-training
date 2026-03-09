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

function parseFunctions(stdout) {
  const payload = JSON.parse(stdout);
  return Array.isArray(payload.result) ? payload.result : [];
}

export async function checkCloudFunctionsDeployment({
  projectId = inferProjectId(),
  execFileImpl = execFile,
  now = () => new Date().toISOString(),
} = {}) {
  const functionsList = await runFirebase(["functions:list", "--project", projectId, "--json"], execFileImpl);
  const output = `${functionsList.stdout}\n${functionsList.stderr}`.trim();

  if (!functionsList.ok) {
    const providerAuthBlocked = /Failed to authenticate|firebase login/i.test(output);
    const projectNotVisible = /Failed to get Firebase project|not found|404/i.test(output);
    return {
      status: providerAuthBlocked
        ? "blocked-provider-auth"
        : projectNotVisible
          ? "blocked-project-access"
          : "failed",
      executedAt: now(),
      projectId,
      errorCode: providerAuthBlocked
        ? "firebase_login_required"
        : projectNotVisible
          ? "project_not_visible"
          : "functions_list_failed",
      output,
    };
  }

  const functions = parseFunctions(functionsList.stdout);
  if (functions.length === 0) {
    return {
      status: "blocked-no-functions-deployed",
      executedAt: now(),
      projectId,
      functionsCount: 0,
    };
  }

  return {
    status: "ready",
    executedAt: now(),
    projectId,
    functionsCount: functions.length,
    functionNames: functions.map((item) => item.id ?? item.name).filter(Boolean),
  };
}

function formatHumanReadable(result) {
  const lines = [
    `status: ${result.status}`,
    `executedAt: ${result.executedAt}`,
    `projectId: ${result.projectId}`,
  ];

  if (typeof result.functionsCount === "number") {
    lines.push(`functionsCount: ${result.functionsCount}`);
  }
  if (Array.isArray(result.functionNames)) {
    lines.push(`functionNames: ${result.functionNames.join(",") || "-"}`);
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
  const result = await checkCloudFunctionsDeployment();
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
