import path from "node:path";
import process from "node:process";
import url from "node:url";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";

const execFile = promisify(execFileCallback);

function inferProjectId() {
  return "flux-training-mvp";
}

async function runDeploy(execFileImpl, projectId) {
  try {
    const result = await execFileImpl(
      "npx",
      [
        "firebase-tools",
        "deploy",
        "--only",
        "functions:backend",
        "--project",
        projectId,
        "--non-interactive",
      ],
      { timeout: 240000, maxBuffer: 1024 * 1024 * 20 },
    );

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

export async function checkCloudBillingReadiness({
  projectId = inferProjectId(),
  execFileImpl = execFile,
  now = () => new Date().toISOString(),
} = {}) {
  const deploy = await runDeploy(execFileImpl, projectId);
  const output = `${deploy.stdout}\n${deploy.stderr}`.trim();

  if (/must be on the Blaze \(pay-as-you-go\) plan|artifactregistry\.googleapis\.com can't be enabled/i.test(output)) {
    return {
      status: "blocked-cloud-billing-required",
      executedAt: now(),
      projectId,
      errorCode: "firebase_blaze_required",
      output,
    };
  }

  if (/Failed to authenticate|firebase login/i.test(output)) {
    return {
      status: "blocked-provider-auth",
      executedAt: now(),
      projectId,
      errorCode: "firebase_login_required",
      output,
    };
  }

  if (/Failed to get Firebase project|not found|404/i.test(output)) {
    return {
      status: "blocked-project-access",
      executedAt: now(),
      projectId,
      errorCode: "project_not_visible",
      output,
    };
  }

  if (/Deploy complete|functions\[[^\]]+\] Successful/i.test(output)) {
    return {
      status: "ready",
      executedAt: now(),
      projectId,
      output,
    };
  }

  return {
    status: deploy.ok ? "ready" : "failed",
    executedAt: now(),
    projectId,
    errorCode: deploy.ok ? undefined : "deploy_failed",
    output,
  };
}

function format(result) {
  const lines = [
    `status: ${result.status}`,
    `executedAt: ${result.executedAt}`,
    `projectId: ${result.projectId}`,
  ];
  if (result.errorCode) lines.push(`errorCode: ${result.errorCode}`);
  if (result.output) lines.push(`output: ${result.output}`);
  return `${lines.join("\n")}\n`;
}

async function runCli() {
  const result = await checkCloudBillingReadiness();
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
