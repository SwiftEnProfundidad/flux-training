import assert from "node:assert/strict";
import test from "node:test";

import { runRealRuntimeDoctor } from "./doctor-real-runtime.mjs";

test("reports blocked-provider-auth-sources when no provider auth sources exist", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-08T20:45:00.000Z",
    checkSourcesImpl: async () => ({ status: "no-provider-auth-sources" }),
    checkReadinessImpl: async () => ({ status: "blocked-provider-auth" }),
    checkProjectAccessImpl: async () => ({ status: "blocked-provider-auth" }),
    runCloudSmokeImpl: async () => ({ status: "blocked-remote-target", apiTarget: "https://example.com" }),
    runLoginSmokeImpl: async () => ({ status: "blocked-real-config" }),
  });

  assert.equal(result.status, "blocked-provider-auth");
  assert.equal(result.nextSteps.length, 4);
});

test("reports blocked-remote-target when provider auth is ready but cloud target is not", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-08T20:45:00.000Z",
    checkSourcesImpl: async () => ({ status: "sources-detected" }),
    checkReadinessImpl: async () => ({ status: "ready" }),
    checkProjectAccessImpl: async () => ({ status: "ready" }),
    runCloudSmokeImpl: async () => ({ status: "blocked-remote-target", apiTarget: "https://example.com" }),
    runLoginSmokeImpl: async () => ({ status: "blocked-real-user-credentials" }),
  });

  assert.equal(result.status, "blocked-remote-target");
  assert.match(result.nextSteps.join("\n"), /URL cloud real/);
  assert.match(result.nextSteps.join("\n"), /FLUX_E2E_EMAIL/);
});

test("reports blocked-project-access when provider auth is ready but authenticated account cannot see the project", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-08T20:45:00.000Z",
    checkSourcesImpl: async () => ({ status: "no-provider-auth-sources" }),
    checkReadinessImpl: async () => ({ status: "ready" }),
    checkProjectAccessImpl: async () => ({ status: "blocked-project-access" }),
    runCloudSmokeImpl: async () => ({ status: "blocked-remote-target", apiTarget: "https://example.com" }),
    runLoginSmokeImpl: async () => ({ status: "blocked-real-config" }),
  });

  assert.equal(result.status, "blocked-project-access");
});

test("reports ready when all checks are ready", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-08T20:45:00.000Z",
    checkSourcesImpl: async () => ({ status: "sources-detected" }),
    checkReadinessImpl: async () => ({ status: "ready" }),
    checkProjectAccessImpl: async () => ({ status: "ready" }),
    runCloudSmokeImpl: async () => ({ status: "ready", apiTarget: "https://example.com" }),
    runLoginSmokeImpl: async () => ({ status: "ready" }),
  });

  assert.equal(result.status, "ready");
  assert.deepEqual(result.nextSteps, []);
});
