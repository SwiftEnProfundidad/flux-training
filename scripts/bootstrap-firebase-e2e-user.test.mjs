import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { bootstrapFirebaseE2EUser } from "./bootstrap-firebase-e2e-user.mjs";

function createWorkspaceFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "flux-bootstrap-firebase-e2e-user-"));
  fs.mkdirSync(path.join(rootDir, "apps/web"), { recursive: true });
  return rootDir;
}

function writeReadyWebEnv(rootDir) {
  fs.writeFileSync(
    path.join(rootDir, "apps/web/.env.local"),
    [
      "VITE_FIREBASE_API_KEY=test-key",
      "VITE_FIREBASE_AUTH_DOMAIN=flux-training-mvp.firebaseapp.com",
      "VITE_FIREBASE_PROJECT_ID=flux-training-mvp",
      "VITE_API_TARGET=https://example.com/api",
    ].join("\n"),
  );
}

test("returns auth readiness blocker when firebase auth is not configured", async () => {
  const rootDir = createWorkspaceFixture();
  writeReadyWebEnv(rootDir);

  const result = await bootstrapFirebaseE2EUser({
    rootDir,
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: { message: "CONFIGURATION_NOT_FOUND" } }), { status: 400 }),
    now: () => "2026-03-09T20:00:00.000Z",
  });

  assert.equal(result.status, "blocked-firebase-auth-configuration");
  assert.equal(result.errorCode, "CONFIGURATION_NOT_FOUND");
});

test("returns blocked-real-user-credentials when e2e credentials are missing", async () => {
  const rootDir = createWorkspaceFixture();
  writeReadyWebEnv(rootDir);

  const result = await bootstrapFirebaseE2EUser({
    rootDir,
    fetchImpl: async () => Response.json({ signinMethods: ["password"] }, { status: 200 }),
    now: () => "2026-03-09T20:00:00.000Z",
  });

  assert.equal(result.status, "blocked-real-user-credentials");
  assert.match(result.blockers.join("\n"), /FLUX_E2E_EMAIL/);
  assert.match(result.blockers.join("\n"), /FLUX_E2E_PASSWORD/);
});

test("returns ready-existing-user when sign in succeeds", async () => {
  const rootDir = createWorkspaceFixture();
  writeReadyWebEnv(rootDir);
  fs.writeFileSync(
    path.join(rootDir, ".env.e2e.local"),
    ["FLUX_E2E_EMAIL=qa@flux.app", "FLUX_E2E_PASSWORD=secret-pass"].join("\n"),
  );

  const calls = [];
  const result = await bootstrapFirebaseE2EUser({
    rootDir,
    fetchImpl: async (input) => {
      const requestUrl = String(input);
      calls.push(requestUrl);
      if (requestUrl.includes("accounts:createAuthUri")) {
        return Response.json({ signinMethods: ["password"] }, { status: 200 });
      }
      if (requestUrl.includes("accounts:signInWithPassword")) {
        return Response.json({ idToken: "token" }, { status: 200 });
      }
      throw new Error(`unexpected request ${requestUrl}`);
    },
    now: () => "2026-03-09T20:00:00.000Z",
  });

  assert.equal(result.status, "ready-existing-user");
  assert.equal(result.userCreated, false);
  assert.equal(result.email, "qa***@flux.app");
  assert.equal(calls.length, 2);
});

test("creates user when firebase reports EMAIL_NOT_FOUND", async () => {
  const rootDir = createWorkspaceFixture();
  writeReadyWebEnv(rootDir);
  fs.writeFileSync(
    path.join(rootDir, ".env.e2e.local"),
    ["FLUX_E2E_EMAIL=qa@flux.app", "FLUX_E2E_PASSWORD=secret-pass"].join("\n"),
  );

  const result = await bootstrapFirebaseE2EUser({
    rootDir,
    fetchImpl: async (input) => {
      const requestUrl = String(input);
      if (requestUrl.includes("accounts:createAuthUri")) {
        return Response.json({ signinMethods: ["password"] }, { status: 200 });
      }
      if (requestUrl.includes("accounts:signInWithPassword")) {
        return Response.json({ error: { message: "EMAIL_NOT_FOUND" } }, { status: 400 });
      }
      if (requestUrl.includes("accounts:signUp")) {
        return Response.json({ idToken: "new-token" }, { status: 200 });
      }
      throw new Error(`unexpected request ${requestUrl}`);
    },
    now: () => "2026-03-09T20:00:00.000Z",
  });

  assert.equal(result.status, "ready-created-user");
  assert.equal(result.userCreated, true);
});

test("fails with firebase-auth stage for invalid credentials", async () => {
  const rootDir = createWorkspaceFixture();
  writeReadyWebEnv(rootDir);
  fs.writeFileSync(
    path.join(rootDir, ".env.e2e.local"),
    ["FLUX_E2E_EMAIL=qa@flux.app", "FLUX_E2E_PASSWORD=secret-pass"].join("\n"),
  );

  const result = await bootstrapFirebaseE2EUser({
    rootDir,
    fetchImpl: async (input) => {
      const requestUrl = String(input);
      if (requestUrl.includes("accounts:createAuthUri")) {
        return Response.json({ signinMethods: ["password"] }, { status: 200 });
      }
      if (requestUrl.includes("accounts:signInWithPassword")) {
        return Response.json({ error: { message: "INVALID_LOGIN_CREDENTIALS" } }, { status: 400 });
      }
      throw new Error(`unexpected request ${requestUrl}`);
    },
    now: () => "2026-03-09T20:00:00.000Z",
  });

  assert.equal(result.status, "failed");
  assert.equal(result.stage, "firebase-auth");
  assert.equal(result.errorCode, "INVALID_LOGIN_CREDENTIALS");
});

test("fails with firebase-signup stage when sign up fails", async () => {
  const rootDir = createWorkspaceFixture();
  writeReadyWebEnv(rootDir);
  fs.writeFileSync(
    path.join(rootDir, ".env.e2e.local"),
    ["FLUX_E2E_EMAIL=qa@flux.app", "FLUX_E2E_PASSWORD=secret-pass"].join("\n"),
  );

  const result = await bootstrapFirebaseE2EUser({
    rootDir,
    fetchImpl: async (input) => {
      const requestUrl = String(input);
      if (requestUrl.includes("accounts:createAuthUri")) {
        return Response.json({ signinMethods: ["password"] }, { status: 200 });
      }
      if (requestUrl.includes("accounts:signInWithPassword")) {
        return Response.json({ error: { message: "EMAIL_NOT_FOUND" } }, { status: 400 });
      }
      if (requestUrl.includes("accounts:signUp")) {
        return Response.json({ error: { message: "OPERATION_NOT_ALLOWED" } }, { status: 400 });
      }
      throw new Error(`unexpected request ${requestUrl}`);
    },
    now: () => "2026-03-09T20:00:00.000Z",
  });

  assert.equal(result.status, "failed");
  assert.equal(result.stage, "firebase-signup");
  assert.equal(result.errorCode, "OPERATION_NOT_ALLOWED");
});
