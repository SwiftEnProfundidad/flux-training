import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();

const toStatus = (status, extra = {}) => ({
  status,
  executedAt: new Date().toISOString(),
  ...extra
});

const fileExists = async (relativePath) => {
  try {
    await access(path.join(repoRoot, relativePath));
    return true;
  } catch {
    return false;
  }
};

const readJson = async (relativePath) => {
  const contents = await readFile(path.join(repoRoot, relativePath), "utf8");
  return JSON.parse(contents);
};

export const evaluateFirebaseDeployConfig = async ({
  firebaseConfig,
  firebaseRc,
  backendPackage,
  backendDistExists
} = {}) => {
  const resolvedFirebaseConfig = firebaseConfig ?? await readJson("firebase.json");
  const resolvedFirebaseRc = firebaseRc ?? await readJson(".firebaserc");
  const resolvedBackendPackage =
    backendPackage ?? await readJson("apps/backend/package.json");
  const resolvedBackendDistExists =
    backendDistExists ?? await fileExists("apps/backend/dist/index.js");

  const functionsConfig = resolvedFirebaseConfig.functions?.[0];
  if (!functionsConfig) {
    return toStatus("blocked-missing-firebase-functions-config");
  }

  const blockers = [];

  if (resolvedFirebaseRc.projects?.default !== "flux-training-mvp") {
    blockers.push("default-project-mismatch");
  }
  if (functionsConfig.source !== "apps/backend") {
    blockers.push("functions-source-mismatch");
  }
  if (functionsConfig.codebase !== "backend") {
    blockers.push("functions-codebase-mismatch");
  }
  if (functionsConfig.runtime !== "nodejs20") {
    blockers.push("functions-runtime-mismatch");
  }
  if (resolvedBackendPackage.main !== "dist/index.js") {
    blockers.push("backend-main-mismatch");
  }
  if (resolvedBackendPackage.engines?.node !== "20") {
    blockers.push("backend-node-engine-mismatch");
  }
  if (!String(resolvedBackendPackage.scripts?.build ?? "").includes("esbuild")) {
    blockers.push("backend-build-not-bundled");
  }

  if (blockers.length > 0) {
    return toStatus("blocked-invalid-firebase-deploy-config", {
      blockers
    });
  }

  return toStatus("ready", {
    backendDistExists: resolvedBackendDistExists
  });
};

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isDirectRun) {
  const result = await evaluateFirebaseDeployConfig();
  console.log(`status: ${result.status}`);
  console.log(`executedAt: ${result.executedAt}`);
  if (result.blockers) {
    console.log(`blockers: ${result.blockers.join(",")}`);
  }
  if (typeof result.backendDistExists === "boolean") {
    console.log(`backendDistExists: ${result.backendDistExists}`);
  }
  process.exit(result.status === "ready" ? 0 : 1);
}
