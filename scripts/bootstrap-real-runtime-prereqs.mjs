import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import url from "node:url";

function ensureFile(targetPath, templatePath) {
  if (fs.existsSync(targetPath)) {
    return { path: targetPath, created: false, source: null };
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(templatePath, targetPath);
  return { path: targetPath, created: true, source: templatePath };
}

export function bootstrapRealRuntimePrereqs(rootDir) {
  const webTemplatePath = path.join(rootDir, "apps/web/.env.example");
  const webTargetPath = path.join(rootDir, "apps/web/.env.local");
  const iosTemplatePath = path.join(rootDir, "apps/ios/.env.local.example");
  const iosTargetPath = path.join(rootDir, "apps/ios/.env.local");
  const e2eTemplatePath = path.join(rootDir, ".env.e2e.local.example");
  const e2eTargetPath = path.join(rootDir, ".env.e2e.local");

  const results = [
    ensureFile(webTargetPath, webTemplatePath),
    ensureFile(iosTargetPath, iosTemplatePath),
    ensureFile(e2eTargetPath, e2eTemplatePath),
  ];

  return {
    rootDir,
    results,
  };
}

function formatHumanReadable(result) {
  return `${result.results
    .map((item) =>
      item.created
        ? `created ${item.path} from ${item.source}`
        : `kept existing ${item.path}`,
    )
    .join("\n")}\n`;
}

function runCli() {
  const currentFile = url.fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const rootDir = path.resolve(currentDir, "..");
  const result = bootstrapRealRuntimePrereqs(rootDir);
  process.stdout.write(formatHumanReadable(result));
}

const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url);

if (isDirectExecution) {
  runCli();
}
