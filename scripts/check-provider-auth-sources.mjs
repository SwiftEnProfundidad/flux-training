import { access } from "node:fs/promises";
import process from "node:process";
import { promisify } from "node:util";
import { execFile as execFileCallback } from "node:child_process";
import path from "node:path";
import url from "node:url";

const execFile = promisify(execFileCallback);

async function fileExists(filePath) {
  if (!filePath) {
    return false;
  }

  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function runCommand(command, args, execFileImpl) {
  try {
    const result = await execFileImpl(command, args);
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
      code: error?.code ?? null,
    };
  }
}

export async function checkProviderAuthSources({
  execFileImpl = execFile,
  env = process.env,
  now = () => new Date().toISOString(),
  fileExistsImpl = fileExists,
} = {}) {
  const firebaseTokenPresent = typeof env.FIREBASE_TOKEN === "string" && env.FIREBASE_TOKEN.trim().length > 0;
  const googleApplicationCredentialsPath =
    typeof env.GOOGLE_APPLICATION_CREDENTIALS === "string" ? env.GOOGLE_APPLICATION_CREDENTIALS : "";
  const googleApplicationCredentialsPresent = await fileExistsImpl(googleApplicationCredentialsPath);

  const gcloudWhich = await runCommand("which", ["gcloud"], execFileImpl);
  const gcloudInstalled = gcloudWhich.ok && gcloudWhich.stdout.trim().length > 0;

  let gcloudAccountsVisible = 0;
  let gcloudAuthStatus = "not-installed";
  let gcloudAdcStatus = "not-installed";

  if (gcloudInstalled) {
    const authList = await runCommand("gcloud", ["auth", "list", "--format=json"], execFileImpl);
    if (authList.ok) {
      try {
        const parsed = JSON.parse(authList.stdout);
        gcloudAccountsVisible = Array.isArray(parsed) ? parsed.length : 0;
        gcloudAuthStatus = gcloudAccountsVisible > 0 ? "ready" : "no-accounts";
      } catch {
        gcloudAuthStatus = "parse-error";
      }
    } else {
      gcloudAuthStatus = "blocked";
    }

    const adcProbe = await runCommand(
      "gcloud",
      ["auth", "application-default", "print-access-token"],
      execFileImpl,
    );
    gcloudAdcStatus = adcProbe.ok && adcProbe.stdout.trim().length > 0 ? "ready" : "blocked";
  }

  const sources = [];

  if (firebaseTokenPresent) {
    sources.push("firebase-token-env");
  }
  if (googleApplicationCredentialsPresent) {
    sources.push("google-application-credentials");
  }
  if (gcloudAuthStatus === "ready") {
    sources.push("gcloud-user-auth");
  }
  if (gcloudAdcStatus === "ready") {
    sources.push("gcloud-adc");
  }

  const status = sources.length > 0 ? "sources-detected" : "no-provider-auth-sources";

  return {
    status,
    executedAt: now(),
    provider: "firebase-gcp",
    firebaseTokenPresent,
    googleApplicationCredentialsPresent,
    gcloudInstalled,
    gcloudAccountsVisible,
    gcloudAuthStatus,
    gcloudAdcStatus,
    sources,
  };
}

function formatHumanReadable(result) {
  return [
    `status: ${result.status}`,
    `executedAt: ${result.executedAt}`,
    `provider: ${result.provider}`,
    `firebaseTokenPresent: ${result.firebaseTokenPresent}`,
    `googleApplicationCredentialsPresent: ${result.googleApplicationCredentialsPresent}`,
    `gcloudInstalled: ${result.gcloudInstalled}`,
    `gcloudAccountsVisible: ${result.gcloudAccountsVisible}`,
    `gcloudAuthStatus: ${result.gcloudAuthStatus}`,
    `gcloudAdcStatus: ${result.gcloudAdcStatus}`,
    `sources: ${result.sources.join(",") || "-"}`,
  ].join("\n") + "\n";
}

function runCli() {
  checkProviderAuthSources()
    .then((result) => {
      process.stdout.write(formatHumanReadable(result));
      if (result.status !== "sources-detected") {
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
