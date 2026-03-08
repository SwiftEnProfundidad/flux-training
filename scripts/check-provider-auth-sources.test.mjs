import assert from "node:assert/strict";
import test from "node:test";

import { checkProviderAuthSources } from "./check-provider-auth-sources.mjs";

test("reports no-provider-auth-sources when nothing is configured", async () => {
  const result = await checkProviderAuthSources({
    env: { HOME: "/tmp/home" },
    now: () => "2026-03-08T18:35:00.000Z",
    fileExistsImpl: async () => false,
    readFileImpl: async () => {
      throw new Error("missing");
    },
    execFileImpl: async (command) => {
      if (command === "which") {
        const error = new Error("not found");
        error.stdout = "";
        error.stderr = "";
        throw error;
      }
      throw new Error(`unexpected command: ${command}`);
    },
  });

  assert.equal(result.status, "no-provider-auth-sources");
  assert.equal(result.firebaseTokenPresent, false);
  assert.equal(result.firebaseCliUserPresent, false);
  assert.equal(result.googleApplicationCredentialsPresent, false);
  assert.equal(result.gcloudInstalled, false);
  assert.deepEqual(result.sources, []);
});

test("reports firebase cli login as a source when configstore contains a logged user", async () => {
  const result = await checkProviderAuthSources({
    env: { HOME: "/tmp/home" },
    now: () => "2026-03-08T18:35:00.000Z",
    fileExistsImpl: async () => false,
    readFileImpl: async (filePath) => {
      assert.match(filePath, /firebase-tools\.json$/);
      return JSON.stringify({ user: { email: "merlosalbarracin@gmail.com" } });
    },
    execFileImpl: async (command) => {
      if (command === "which") {
        const error = new Error("not found");
        error.stdout = "";
        error.stderr = "";
        throw error;
      }
      throw new Error(`unexpected command: ${command}`);
    },
  });

  assert.equal(result.status, "sources-detected");
  assert.equal(result.firebaseCliUserPresent, true);
  assert.deepEqual(result.sources, ["firebase-cli-login"]);
});

test("reports env and gcloud sources when available", async () => {
  const result = await checkProviderAuthSources({
    env: {
      HOME: "/tmp/home",
      FIREBASE_TOKEN: "set",
      GOOGLE_APPLICATION_CREDENTIALS: "/tmp/gcloud.json",
    },
    now: () => "2026-03-08T18:35:00.000Z",
    fileExistsImpl: async (filePath) => filePath === "/tmp/gcloud.json",
    readFileImpl: async () => JSON.stringify({ user: { email: "dev@flux.app" } }),
    execFileImpl: async (command, args) => {
      if (command === "which") {
        return { stdout: "/usr/local/bin/gcloud\n", stderr: "" };
      }
      if (command === "gcloud" && args.join(" ") === "auth list --format=json") {
        return {
          stdout: JSON.stringify([{ account: "dev@flux.app", status: "ACTIVE" }]),
          stderr: "",
        };
      }
      if (command === "gcloud" && args.join(" ") === "auth application-default print-access-token") {
        return { stdout: "ya29.token\n", stderr: "" };
      }
      throw new Error(`unexpected command: ${command} ${args.join(" ")}`);
    },
  });

  assert.equal(result.status, "sources-detected");
  assert.equal(result.firebaseTokenPresent, true);
  assert.equal(result.firebaseCliUserPresent, true);
  assert.equal(result.googleApplicationCredentialsPresent, true);
  assert.equal(result.gcloudInstalled, true);
  assert.equal(result.gcloudAccountsVisible, 1);
  assert.equal(result.gcloudAuthStatus, "ready");
  assert.equal(result.gcloudAdcStatus, "ready");
  assert.deepEqual(result.sources, [
    "firebase-token-env",
    "firebase-cli-login",
    "google-application-credentials",
    "gcloud-user-auth",
    "gcloud-adc",
  ]);
});

test("reports blocked gcloud auth when binary exists but no account sources are usable", async () => {
  const result = await checkProviderAuthSources({
    env: { HOME: "/tmp/home" },
    now: () => "2026-03-08T18:35:00.000Z",
    fileExistsImpl: async () => false,
    readFileImpl: async () => {
      throw new Error("missing");
    },
    execFileImpl: async (command, args) => {
      if (command === "which") {
        return { stdout: "/usr/local/bin/gcloud\n", stderr: "" };
      }
      if (command === "gcloud" && args.join(" ") === "auth list --format=json") {
        return { stdout: "[]", stderr: "" };
      }
      if (command === "gcloud" && args.join(" ") === "auth application-default print-access-token") {
        const error = new Error("adc missing");
        error.stdout = "";
        error.stderr = "You do not currently have an active account selected.";
        throw error;
      }
      throw new Error(`unexpected command: ${command} ${args.join(" ")}`);
    },
  });

  assert.equal(result.status, "no-provider-auth-sources");
  assert.equal(result.gcloudInstalled, true);
  assert.equal(result.gcloudAccountsVisible, 0);
  assert.equal(result.gcloudAuthStatus, "no-accounts");
  assert.equal(result.gcloudAdcStatus, "blocked");
  assert.deepEqual(result.sources, []);
});
