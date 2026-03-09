import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { checkFirebaseAuthReadiness } from "./check-firebase-auth-readiness.mjs";

function createWorkspaceFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "flux-firebase-auth-readiness-"));
  fs.mkdirSync(path.join(rootDir, "apps/web"), { recursive: true });
  return rootDir;
}

test("reports blocked-real-config when web firebase config is missing", async () => {
  const rootDir = createWorkspaceFixture();
  const result = await checkFirebaseAuthReadiness({
    rootDir,
    fetchImpl: async () => {
      throw new Error("fetch should not run");
    },
    now: () => "2026-03-09T16:00:00.000Z",
  });

  assert.equal(result.status, "blocked-real-config");
  assert.equal(result.errorCode, "firebase_web_config_missing");
});

test("reports blocked-firebase-auth-configuration on CONFIGURATION_NOT_FOUND", async () => {
  const rootDir = createWorkspaceFixture();
  fs.writeFileSync(path.join(rootDir, "apps/web/.env.local"), [
    "VITE_FIREBASE_API_KEY=test-key",
    "VITE_FIREBASE_AUTH_DOMAIN=flux-training-mvp.firebaseapp.com",
    "VITE_FIREBASE_PROJECT_ID=flux-training-mvp",
  ].join("\n"));

  const result = await checkFirebaseAuthReadiness({
    rootDir,
    fetchImpl: async () => new Response(JSON.stringify({ error: { message: "CONFIGURATION_NOT_FOUND" } }), { status: 400 }),
    now: () => "2026-03-09T16:00:00.000Z",
  });

  assert.equal(result.status, "blocked-firebase-auth-configuration");
  assert.equal(result.errorCode, "CONFIGURATION_NOT_FOUND");
});

test("reports ready when createAuthUri succeeds", async () => {
  const rootDir = createWorkspaceFixture();
  fs.writeFileSync(path.join(rootDir, "apps/web/.env.local"), [
    "VITE_FIREBASE_API_KEY=test-key",
    "VITE_FIREBASE_AUTH_DOMAIN=flux-training-mvp.firebaseapp.com",
    "VITE_FIREBASE_PROJECT_ID=flux-training-mvp",
  ].join("\n"));

  const result = await checkFirebaseAuthReadiness({
    rootDir,
    fetchImpl: async () => Response.json({ signinMethods: ["password"] }),
    now: () => "2026-03-09T16:00:00.000Z",
  });

  assert.equal(result.status, "ready");
  assert.equal(result.projectId, "flux-training-mvp");
});
