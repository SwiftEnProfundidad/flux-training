import process from "node:process";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";
import path from "node:path";
import url from "node:url";

const execFile = promisify(execFileCallback);

export async function checkProviderAuthReadiness({
  execFileImpl = execFile,
  now = () => new Date().toISOString(),
} = {}) {
  try {
    const { stdout } = await execFileImpl("npx", ["--yes", "firebase-tools", "projects:list", "--json"]);
    const payload = JSON.parse(stdout);
    const projects = Array.isArray(payload.result) ? payload.result : [];

    return {
      status: "ready",
      executedAt: now(),
      provider: "firebase",
      projectsVisible: projects.length,
    };
  } catch (error) {
    const stderr = String(error?.stderr ?? "");
    const stdout = String(error?.stdout ?? "");
    const combinedOutput = `${stdout}\n${stderr}`.trim();
    const requiresLogin = /Failed to authenticate|firebase login/i.test(combinedOutput);

    return {
      status: requiresLogin ? "blocked-provider-auth" : "failed",
      executedAt: now(),
      provider: "firebase",
      errorCode: requiresLogin ? "firebase_login_required" : "firebase_cli_failed",
      output: combinedOutput,
    };
  }
}

function formatHumanReadable(result) {
  const lines = [
    `status: ${result.status}`,
    `executedAt: ${result.executedAt}`,
    `provider: ${result.provider}`,
  ];

  if (result.status === "ready") {
    lines.push(`projectsVisible: ${result.projectsVisible}`);
    return `${lines.join("\n")}\n`;
  }

  lines.push(`errorCode: ${result.errorCode}`);
  if (result.output.length > 0) {
    lines.push(`output: ${result.output}`);
  }
  return `${lines.join("\n")}\n`;
}

function runCli() {
  checkProviderAuthReadiness()
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

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);

if (isDirectExecution) {
  runCli();
}
