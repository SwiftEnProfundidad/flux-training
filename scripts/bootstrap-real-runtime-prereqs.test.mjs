import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { bootstrapRealRuntimePrereqs } from "./bootstrap-real-runtime-prereqs.mjs";

function createWorkspaceFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "flux-bootstrap-real-runtime-"));
  fs.mkdirSync(path.join(rootDir, "apps/web"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "apps/ios"), { recursive: true });
  fs.writeFileSync(path.join(rootDir, "apps/web/.env.example"), "VITE_API_TARGET=https://example.com\n");
  fs.writeFileSync(path.join(rootDir, "apps/ios/.env.local.example"), "FLUX_BACKEND_BASE_URL=https://example.com\n");
  return rootDir;
}

test("creates missing web and ios local env files from templates", () => {
  const rootDir = createWorkspaceFixture();

  const result = bootstrapRealRuntimePrereqs(rootDir);

  assert.equal(result.results.every((item) => item.created), true);
  assert.equal(fs.existsSync(path.join(rootDir, "apps/web/.env.local")), true);
  assert.equal(fs.existsSync(path.join(rootDir, "apps/ios/.env.local")), true);
});

test("does not overwrite existing local env files", () => {
  const rootDir = createWorkspaceFixture();
  const webTarget = path.join(rootDir, "apps/web/.env.local");
  const iosTarget = path.join(rootDir, "apps/ios/.env.local");
  fs.writeFileSync(webTarget, "WEB=existing\n");
  fs.writeFileSync(iosTarget, "IOS=existing\n");

  const result = bootstrapRealRuntimePrereqs(rootDir);

  assert.equal(result.results.every((item) => item.created === false), true);
  assert.equal(fs.readFileSync(webTarget, "utf8"), "WEB=existing\n");
  assert.equal(fs.readFileSync(iosTarget, "utf8"), "IOS=existing\n");
});
