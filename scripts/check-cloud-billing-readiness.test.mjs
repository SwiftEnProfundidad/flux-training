import assert from "node:assert/strict";
import test from "node:test";

import { checkCloudBillingReadiness } from "./check-cloud-billing-readiness.mjs";

test("reports blocked-cloud-billing-required when firebase requires Blaze", async () => {
  const result = await checkCloudBillingReadiness({
    projectId: "flux-training-mvp",
    execFileImpl: async () => {
      const error = new Error("blaze");
      error.stdout = "";
      error.stderr = "Your project flux-training-mvp must be on the Blaze (pay-as-you-go) plan to complete this command. Required API artifactregistry.googleapis.com can't be enabled until the upgrade is complete.";
      throw error;
    },
    now: () => "2026-03-08T22:30:00.000Z",
  });

  assert.equal(result.status, "blocked-cloud-billing-required");
  assert.equal(result.errorCode, "firebase_blaze_required");
});

test("reports blocked-provider-auth when firebase login is missing", async () => {
  const result = await checkCloudBillingReadiness({
    projectId: "flux-training-mvp",
    execFileImpl: async () => {
      const error = new Error("auth");
      error.stdout = "";
      error.stderr = "Failed to authenticate, have you run firebase login?";
      throw error;
    },
    now: () => "2026-03-08T22:30:00.000Z",
  });

  assert.equal(result.status, "blocked-provider-auth");
});

test("reports ready when deploy output is successful", async () => {
  const result = await checkCloudBillingReadiness({
    projectId: "flux-training-mvp",
    execFileImpl: async () => ({ stdout: "Deploy complete!", stderr: "" }),
    now: () => "2026-03-08T22:30:00.000Z",
  });

  assert.equal(result.status, "ready");
});
