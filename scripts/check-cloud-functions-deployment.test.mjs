import assert from "node:assert/strict";
import test from "node:test";

import { checkCloudFunctionsDeployment } from "./check-cloud-functions-deployment.mjs";

test("reports blocked-provider-auth when firebase cli auth is missing", async () => {
  const result = await checkCloudFunctionsDeployment({
    projectId: "flux-training-mvp",
    execFileImpl: async () => {
      const error = new Error("auth required");
      error.stdout = "";
      error.stderr = "Failed to authenticate, have you run firebase login?";
      throw error;
    },
    now: () => "2026-03-08T21:45:00.000Z",
  });

  assert.equal(result.status, "blocked-provider-auth");
  assert.equal(result.errorCode, "firebase_login_required");
});

test("reports blocked-project-access when project is not visible", async () => {
  const result = await checkCloudFunctionsDeployment({
    projectId: "flux-training-mvp",
    execFileImpl: async () => {
      const error = new Error("missing project");
      error.stdout = "";
      error.stderr = "Failed to get Firebase project flux-training-mvp. Please make sure the project exists and your account has permission to access it.";
      throw error;
    },
    now: () => "2026-03-08T21:45:00.000Z",
  });

  assert.equal(result.status, "blocked-project-access");
  assert.equal(result.errorCode, "project_not_visible");
});

test("reports blocked-no-functions-deployed when project has zero functions", async () => {
  const result = await checkCloudFunctionsDeployment({
    projectId: "flux-training-mvp",
    execFileImpl: async () => ({
      stdout: JSON.stringify({ status: "success", result: [] }),
      stderr: "",
    }),
    now: () => "2026-03-08T21:45:00.000Z",
  });

  assert.equal(result.status, "blocked-no-functions-deployed");
  assert.equal(result.functionsCount, 0);
});

test("reports ready when functions are deployed", async () => {
  const result = await checkCloudFunctionsDeployment({
    projectId: "flux-training-mvp",
    execFileImpl: async () => ({
      stdout: JSON.stringify({
        status: "success",
        result: [{ id: "createAuthSession" }, { id: "getProgressSummary" }],
      }),
      stderr: "",
    }),
    now: () => "2026-03-08T21:45:00.000Z",
  });

  assert.equal(result.status, "ready");
  assert.equal(result.functionsCount, 2);
  assert.deepEqual(result.functionNames, ["createAuthSession", "getProgressSummary"]);
});
