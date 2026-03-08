import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { evaluateRealRuntimePrereqs } from "./check-real-runtime-prereqs.mjs";

function createWorkspaceFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "flux-real-runtime-"));
  fs.mkdirSync(path.join(rootDir, "apps/web"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "apps/backend"), { recursive: true });
  return rootDir;
}

test("reports blocked when web env file is missing", () => {
  const rootDir = createWorkspaceFixture();

  const result = evaluateRealRuntimePrereqs({
    rootDir,
    iosEnvironment: {},
  });

  assert.equal(result.status, "blocked-external-config");
  assert.equal(result.web.exists, false);
  assert.match(result.blockers.join("\n"), /apps\/web\/\.env\.local ausente/);
});

test("reports ready when required web and ios values are present", () => {
  const rootDir = createWorkspaceFixture();
  fs.writeFileSync(
    path.join(rootDir, "apps/web/.env.local"),
    [
      "VITE_FIREBASE_API_KEY=test-key",
      "VITE_FIREBASE_AUTH_DOMAIN=test.firebaseapp.com",
      "VITE_FIREBASE_PROJECT_ID=flux-training",
      "VITE_API_TARGET=https://example.com",
    ].join("\n"),
  );

  const result = evaluateRealRuntimePrereqs({
    rootDir,
    iosEnvironment: {
      FLUX_BACKEND_BASE_URL: "https://example.com",
      FLUX_FIREBASE_WEB_API_KEY: "ios-key",
      FLUX_IOS_CLIENT_VERSION: "0.1.0",
    },
  });

  assert.equal(result.status, "ready");
  assert.equal(result.blockers.length, 0);
  assert.equal(result.web.required.every((item) => item.present), true);
  assert.equal(result.ios.required.every((item) => item.present), true);
  assert.equal(result.ios.optional[0].present, false);
});

test("uses apps/ios/.env.local as valid source for iOS runtime configuration", () => {
  const rootDir = createWorkspaceFixture();
  fs.writeFileSync(
    path.join(rootDir, "apps/web/.env.local"),
    [
      "VITE_FIREBASE_API_KEY=test-key",
      "VITE_FIREBASE_AUTH_DOMAIN=test.firebaseapp.com",
      "VITE_FIREBASE_PROJECT_ID=flux-training",
      "VITE_API_TARGET=https://example.com",
    ].join("\n"),
  );
  fs.mkdirSync(path.join(rootDir, "apps/ios"), { recursive: true });
  fs.writeFileSync(
    path.join(rootDir, "apps/ios/.env.local"),
    [
      "FLUX_BACKEND_BASE_URL=https://example.com",
      "FLUX_FIREBASE_WEB_API_KEY=ios-key",
      "FLUX_IOS_CLIENT_VERSION=0.1.0",
    ].join("\n"),
  );

  const result = evaluateRealRuntimePrereqs({
    rootDir,
    iosEnvironment: {},
  });

  assert.equal(result.status, "ready");
  assert.equal(result.ios.envFileExists, true);
  assert.equal(result.ios.required.every((item) => item.present), true);
});
