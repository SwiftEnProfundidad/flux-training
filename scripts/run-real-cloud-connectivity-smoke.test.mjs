import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runRealCloudConnectivitySmoke } from "./run-real-cloud-connectivity-smoke.mjs";

function createWorkspaceFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "flux-real-cloud-connectivity-"));
  fs.mkdirSync(path.join(rootDir, "apps/web"), { recursive: true });
  fs.mkdirSync(path.join(rootDir, "apps/ios"), { recursive: true });
  return rootDir;
}

test("reports blocked when no real api target exists", async () => {
  const rootDir = createWorkspaceFixture();

  const result = await runRealCloudConnectivitySmoke({
    rootDir,
    fetchImpl: async () => {
      throw new Error("fetch should not execute");
    },
    now: () => "2026-03-08T18:10:00.000Z",
  });

  assert.equal(result.status, "blocked-real-config");
  assert.match(result.blockers.join("\n"), /faltan endpoints reales/);
});

test("uses VITE_API_TARGET and reports ready when auth probe resolves without 404", async () => {
  const rootDir = createWorkspaceFixture();
  fs.writeFileSync(path.join(rootDir, "apps/web/.env.local"), "VITE_API_TARGET=https://example.com\n");

  const result = await runRealCloudConnectivitySmoke({
    rootDir,
    fetchImpl: async (input, init = {}) => {
      assert.equal(String(input), "https://example.com/createAuthSession");
      assert.equal(init.method, "POST");
      return Response.json({ error: "invalid_provider_token" }, { status: 400 });
    },
    now: () => "2026-03-08T18:10:00.000Z",
  });

  assert.equal(result.status, "ready");
  assert.equal(result.apiTarget, "https://example.com");
  assert.equal(result.statusCode, 400);
  assert.deepEqual(result.payload, { error: "invalid_provider_token" });
  assert.equal(result.attempts.length, 1);
});

test("falls back to FLUX_BACKEND_BASE_URL and reports backend probe failure on 404", async () => {
  const rootDir = createWorkspaceFixture();
  fs.writeFileSync(
    path.join(rootDir, "apps/ios/.env.local"),
    "FLUX_BACKEND_BASE_URL=https://ios.example.com\n",
  );

  const result = await runRealCloudConnectivitySmoke({
    rootDir,
    fetchImpl: async (input, init = {}) => {
      assert.equal(String(input), "https://ios.example.com/createAuthSession");
      assert.equal(init.method, "POST");
      return Response.json({ error: "down" }, { status: 503 });
    },
    now: () => "2026-03-08T18:10:00.000Z",
  });

  assert.equal(result.status, "ready");
  assert.equal(result.statusCode, 503);
});

test("reports blocked-remote-target when cloud routes return 404 in every candidate", async () => {
  const rootDir = createWorkspaceFixture();
  fs.writeFileSync(
    path.join(rootDir, "apps/web/.env.local"),
    "VITE_API_TARGET=https://us-central1-flux-training.cloudfunctions.net/flux-training\n",
  );

  const calls = [];
  const result = await runRealCloudConnectivitySmoke({
    rootDir,
    fetchImpl: async (input, init = {}) => {
      calls.push(String(input));
      assert.equal(init.method, "POST");
      return Response.json({ error: "not_found" }, { status: 404 });
    },
    now: () => "2026-03-08T18:10:00.000Z",
  });

  assert.equal(result.status, "blocked-remote-target");
  assert.equal(result.stage, "backend-probe");
  assert.equal(result.statusCode, 404);
  assert.deepEqual(calls, [
    "https://us-central1-flux-training.cloudfunctions.net/flux-training/createAuthSession",
    "https://us-central1-flux-training.cloudfunctions.net/createAuthSession",
  ]);
  assert.equal(result.attempts.length, 2);
});

test("reports failed when backend probe errors before getting any valid HTTP response", async () => {
  const rootDir = createWorkspaceFixture();
  fs.writeFileSync(path.join(rootDir, "apps/web/.env.local"), "VITE_API_TARGET=https://missing.example.com\n");

  const result = await runRealCloudConnectivitySmoke({
    rootDir,
    fetchImpl: async () => {
      throw new Error("ECONNREFUSED");
    },
    now: () => "2026-03-08T18:10:00.000Z",
  });

  assert.equal(result.status, "failed");
  assert.equal(result.stage, "backend-probe");
  assert.equal(result.errorCode, "ECONNREFUSED");
  assert.equal(result.attempts.length, 1);
});
