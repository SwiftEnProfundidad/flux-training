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
    checkFunctionsDeploymentImpl: async () => ({ status: "blocked-provider-auth" }),
    checkBillingReadinessImpl: async () => ({ status: "blocked-provider-auth" }),
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
    checkFunctionsDeploymentImpl: async () => ({ status: "ready" }),
    checkBillingReadinessImpl: async () => ({ status: "ready" }),
    checkFirebaseAuthReadinessImpl: async () => ({ status: "ready" }),
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
    checkFunctionsDeploymentImpl: async () => ({ status: "blocked-project-access" }),
    checkBillingReadinessImpl: async () => ({ status: "blocked-project-access" }),
    runCloudSmokeImpl: async () => ({ status: "blocked-remote-target", apiTarget: "https://example.com" }),
    runLoginSmokeImpl: async () => ({ status: "blocked-real-config" }),
  });

  assert.equal(result.status, "blocked-project-access");
});

test("reports blocked-cloud-functions-api-disabled when project is visible but functions api is disabled", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-08T20:45:00.000Z",
    checkSourcesImpl: async () => ({ status: "sources-detected" }),
    checkReadinessImpl: async () => ({ status: "ready" }),
    checkProjectAccessImpl: async () => ({ status: "blocked-cloud-functions-api-disabled" }),
    checkFunctionsDeploymentImpl: async () => ({ status: "blocked-cloud-functions-api-disabled" }),
    checkBillingReadinessImpl: async () => ({ status: "blocked-cloud-functions-api-disabled" }),
    runCloudSmokeImpl: async () => ({ status: "blocked-remote-target", apiTarget: "https://example.com" }),
    runLoginSmokeImpl: async () => ({ status: "blocked-real-config" }),
  });

  assert.equal(result.status, "blocked-cloud-functions-api-disabled");
  assert.match(result.nextSteps.join("\n"), /Cloud Functions API/);
});

test("reports blocked-no-functions-deployed when project is ready but backend is not deployed", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-08T20:45:00.000Z",
    checkSourcesImpl: async () => ({ status: "sources-detected" }),
    checkReadinessImpl: async () => ({ status: "ready" }),
    checkProjectAccessImpl: async () => ({ status: "ready" }),
    checkFunctionsDeploymentImpl: async () => ({ status: "blocked-no-functions-deployed" }),
    checkBillingReadinessImpl: async () => ({ status: "ready" }),
    runCloudSmokeImpl: async () => ({ status: "blocked-remote-target", apiTarget: "https://example.com" }),
    runLoginSmokeImpl: async () => ({ status: "blocked-real-user-credentials" }),
  });

  assert.equal(result.status, "blocked-no-functions-deployed");
  assert.match(result.nextSteps.join("\n"), /Desplegar las Cloud Functions reales del backend/);
});

test("reports ready when all checks are ready", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-08T20:45:00.000Z",
    checkSourcesImpl: async () => ({ status: "sources-detected" }),
    checkReadinessImpl: async () => ({ status: "ready" }),
    checkProjectAccessImpl: async () => ({ status: "ready" }),
    checkFunctionsDeploymentImpl: async () => ({ status: "ready" }),
    checkBillingReadinessImpl: async () => ({ status: "ready" }),
    runCloudSmokeImpl: async () => ({ status: "ready", apiTarget: "https://example.com" }),
    runLoginSmokeImpl: async () => ({ status: "ready" }),
  });

  assert.equal(result.status, "ready");
  assert.deepEqual(result.nextSteps, []);
});

test("reports blocked-cloud-billing-required before blocked-no-functions-deployed when deploy probe requires Blaze", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-08T20:45:00.000Z",
    checkSourcesImpl: async () => ({ status: "sources-detected" }),
    checkReadinessImpl: async () => ({ status: "ready" }),
    checkProjectAccessImpl: async () => ({ status: "ready" }),
    checkFunctionsDeploymentImpl: async () => ({ status: "blocked-no-functions-deployed" }),
    checkBillingReadinessImpl: async () => ({ status: "blocked-cloud-billing-required" }),
    runCloudSmokeImpl: async () => ({ status: "blocked-remote-target", apiTarget: "https://example.com" }),
    runLoginSmokeImpl: async () => ({ status: "blocked-real-user-credentials" }),
  });

  assert.equal(result.status, "blocked-cloud-billing-required");
  assert.match(result.nextSteps.join("\n"), /Blaze/);
  assert.doesNotMatch(result.nextSteps.join("\n"), /Desplegar las Cloud Functions reales del backend/);
});


test("doctor prioritizes firebase auth configuration before login credentials", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-09T16:15:00.000Z",
    checkSourcesImpl: async () => ({ status: "sources-detected" }),
    checkReadinessImpl: async () => ({ status: "ready" }),
    checkProjectAccessImpl: async () => ({ status: "ready" }),
    checkBillingReadinessImpl: async () => ({ status: "ready" }),
    checkFunctionsDeploymentImpl: async () => ({ status: "ready" }),
    checkFirebaseAuthReadinessImpl: async () => ({ status: "blocked-firebase-auth-configuration" }),
    runCloudSmokeImpl: async () => ({ status: "ready" }),
    runLoginSmokeImpl: async () => ({ status: "blocked-real-user-credentials" }),
  });

  assert.equal(result.status, "blocked-firebase-auth-configuration");
  assert.match(result.nextSteps.join("\n"), /Activar Firebase Auth/);
});

test("doctor ignores firebase billing blocker when alternative cloud target is already ready", async () => {
  const result = await runRealRuntimeDoctor({
    rootDir: "/tmp/flux",
    now: () => "2026-03-09T16:30:00.000Z",
    checkSourcesImpl: async () => ({ status: "sources-detected" }),
    checkReadinessImpl: async () => ({ status: "ready" }),
    checkProjectAccessImpl: async () => ({ status: "ready" }),
    checkBillingReadinessImpl: async () => ({ status: "blocked-cloud-billing-required" }),
    checkFunctionsDeploymentImpl: async () => ({ status: "blocked-no-functions-deployed" }),
    checkFirebaseAuthReadinessImpl: async () => ({ status: "blocked-firebase-auth-configuration" }),
    runCloudSmokeImpl: async () => ({ status: "ready", apiTarget: "https://example.com/api" }),
    runLoginSmokeImpl: async () => ({ status: "blocked-real-user-credentials" }),
  });

  assert.equal(result.status, "blocked-firebase-auth-configuration");
  assert.match(result.nextSteps.join("\n"), /Activar Firebase Auth/);
  assert.doesNotMatch(result.nextSteps.join("\n"), /Blaze/);
  assert.doesNotMatch(result.nextSteps.join("\n"), /Cloud Functions reales del backend/);
});
