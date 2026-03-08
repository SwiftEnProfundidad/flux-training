import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { runRealLoginSmoke } from "./run-real-login-smoke.mjs";

function createWorkspaceFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "flux-real-login-smoke-"));
  fs.mkdirSync(path.join(rootDir, "apps/web"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "apps/backend"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "apps/ios"), { recursive: true });
  return rootDir;
}

test("reports blocked when real config is missing", async () => {
  const rootDir = createWorkspaceFixture();

  const result = await runRealLoginSmoke({
    rootDir,
    fetchImpl: async () => {
      throw new Error("fetch should not execute");
    },
    iosEnvironment: {},
    e2eEnvironment: {},
    now: () => "2026-03-08T19:05:00.000Z",
  });

  assert.equal(result.status, "blocked-real-config");
  assert.equal(result.readiness.platformConfigStatus, "blocked-real-config");
  assert.equal(result.readiness.testIdentityStatus, "blocked-real-user-credentials");
  assert.match(result.blockers.join("\n"), /faltan claves web reales/);
  assert.match(result.blockers.join("\n"), /faltan credenciales E2E reales/);
});

test("reports blocked by test identity when platform config is ready but e2e user is missing", async () => {
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
  fs.writeFileSync(
    path.join(rootDir, "apps/ios/.env.local"),
    [
      "FLUX_BACKEND_BASE_URL=https://example.com",
      "FLUX_FIREBASE_WEB_API_KEY=ios-key",
      "FLUX_IOS_CLIENT_VERSION=0.1.0",
    ].join("\n"),
  );

  const result = await runRealLoginSmoke({
    rootDir,
    fetchImpl: async () => {
      throw new Error("fetch should not execute");
    },
    iosEnvironment: {},
    e2eEnvironment: {},
    now: () => "2026-03-08T19:05:00.000Z",
  });

  assert.equal(result.status, "blocked-real-user-credentials");
  assert.equal(result.readiness.platformConfigStatus, "ready");
  assert.equal(result.readiness.testIdentityStatus, "blocked-real-user-credentials");
  assert.match(result.blockers.join("\n"), /faltan credenciales E2E reales/);
});

test("reports ready when firebase auth, backend session and post-login probe succeed", async () => {
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
  fs.writeFileSync(
    path.join(rootDir, ".env.e2e.local"),
    ["FLUX_E2E_EMAIL=qa@flux.app", "FLUX_E2E_PASSWORD=secret-pass"].join("\n"),
  );
  fs.writeFileSync(
    path.join(rootDir, "apps/ios/.env.local"),
    [
      "FLUX_BACKEND_BASE_URL=https://example.com",
      "FLUX_FIREBASE_WEB_API_KEY=ios-key",
      "FLUX_IOS_CLIENT_VERSION=0.1.0",
    ].join("\n"),
  );

  const calledUrls = [];
  const fetchImpl = async (input, init = {}) => {
    const requestUrl = String(input);
    calledUrls.push(requestUrl);
    if (requestUrl.includes("identitytoolkit.googleapis.com")) {
      return Response.json({ idToken: "firebase-token" }, { status: 200 });
    }
    if (requestUrl === "https://example.com/createAuthSession") {
      return Response.json(
        {
          session: {
            userId: "user-1",
            sessionId: "session-1",
            token: "firebase-token",
            expiresAt: "2026-03-08T20:00:00.000Z",
          },
        },
        { status: 201 },
      );
    }
    if (requestUrl === "https://example.com/getProgressSummary?userId=user-1") {
      assert.equal(init.headers.Authorization, "Bearer firebase-token");
      return Response.json({ summary: { workoutSessionsCount: 0 } }, { status: 200 });
    }
    throw new Error(`unexpected request ${requestUrl}`);
  };

  const result = await runRealLoginSmoke({
    rootDir,
    fetchImpl,
    iosEnvironment: {},
    e2eEnvironment: {},
    now: () => "2026-03-08T19:05:00.000Z",
  });

  assert.equal(result.status, "ready");
  assert.equal(result.session.userId, "user-1");
  assert.equal(result.postLogin.hasSummary, true);
  assert.deepEqual(calledUrls, [
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test-key",
    "https://example.com/createAuthSession",
    "https://example.com/getProgressSummary?userId=user-1",
  ]);
});

test("reports firebase auth failure without exposing password or full email", async () => {
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
  fs.writeFileSync(
    path.join(rootDir, ".env.e2e.local"),
    ["FLUX_E2E_EMAIL=qa@flux.app", "FLUX_E2E_PASSWORD=secret-pass"].join("\n"),
  );
  fs.writeFileSync(
    path.join(rootDir, "apps/ios/.env.local"),
    [
      "FLUX_BACKEND_BASE_URL=https://example.com",
      "FLUX_FIREBASE_WEB_API_KEY=ios-key",
      "FLUX_IOS_CLIENT_VERSION=0.1.0",
    ].join("\n"),
  );

  const result = await runRealLoginSmoke({
    rootDir,
    fetchImpl: async () =>
      Response.json({ error: { message: "INVALID_LOGIN_CREDENTIALS" } }, { status: 400 }),
    iosEnvironment: {},
    e2eEnvironment: {},
    now: () => "2026-03-08T19:05:00.000Z",
  });

  assert.equal(result.status, "failed");
  assert.equal(result.stage, "firebase-auth");
  assert.equal(result.errorCode, "INVALID_LOGIN_CREDENTIALS");
  assert.equal(result.firebase.email, "qa***@flux.app");
});
