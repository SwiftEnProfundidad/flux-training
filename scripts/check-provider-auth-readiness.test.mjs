import assert from "node:assert/strict";
import test from "node:test";

import { checkProviderAuthReadiness } from "./check-provider-auth-readiness.mjs";

test("reports ready when firebase projects list succeeds", async () => {
  const result = await checkProviderAuthReadiness({
    execFileImpl: async () => ({
      stdout: JSON.stringify({
        status: "success",
        result: [{ projectId: "flux-training-mvp" }],
      }),
      stderr: "",
    }),
    now: () => "2026-03-08T18:20:00.000Z",
  });

  assert.equal(result.status, "ready");
  assert.equal(result.provider, "firebase");
  assert.equal(result.projectsVisible, 1);
});

test("reports blocked-provider-auth when firebase cli requires login", async () => {
  const result = await checkProviderAuthReadiness({
    execFileImpl: async () => {
      const error = new Error("firebase auth required");
      error.stdout = JSON.stringify({ status: "error" });
      error.stderr = "Failed to authenticate, have you run firebase login?";
      throw error;
    },
    now: () => "2026-03-08T18:20:00.000Z",
  });

  assert.equal(result.status, "blocked-provider-auth");
  assert.equal(result.errorCode, "firebase_login_required");
  assert.match(result.output, /firebase login/i);
});

test("reports failed when firebase cli errors for a non-auth reason", async () => {
  const result = await checkProviderAuthReadiness({
    execFileImpl: async () => {
      const error = new Error("network failed");
      error.stdout = "";
      error.stderr = "ECONNRESET";
      throw error;
    },
    now: () => "2026-03-08T18:20:00.000Z",
  });

  assert.equal(result.status, "failed");
  assert.equal(result.errorCode, "firebase_cli_failed");
  assert.match(result.output, /ECONNRESET/);
});
