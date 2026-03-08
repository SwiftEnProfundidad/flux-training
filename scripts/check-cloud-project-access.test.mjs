import assert from "node:assert/strict";
import test from "node:test";

import { checkCloudProjectAccess } from "./check-cloud-project-access.mjs";

test("reports blocked-provider-auth when projects list fails", async () => {
  const result = await checkCloudProjectAccess({
    projectId: "flux-training-mvp",
    execFileImpl: async () => {
      const error = new Error("auth required");
      error.stdout = "";
      error.stderr = "Failed to authenticate, have you run firebase login?";
      throw error;
    },
    now: () => "2026-03-08T20:55:00.000Z",
  });

  assert.equal(result.status, "blocked-provider-auth");
  assert.equal(result.errorCode, "firebase_projects_list_failed");
});

test("reports blocked-project-access when project is not visible", async () => {
  const result = await checkCloudProjectAccess({
    projectId: "flux-training-mvp",
    execFileImpl: async (_command, args) => {
      if (args.includes("projects:list")) {
        return {
          stdout: JSON.stringify({ result: [{ projectId: "closedcaptioning-cfba8" }] }),
          stderr: "",
        };
      }
      throw new Error("unexpected command");
    },
    now: () => "2026-03-08T20:55:00.000Z",
  });

  assert.equal(result.status, "blocked-project-access");
  assert.equal(result.errorCode, "project_not_visible");
  assert.deepEqual(result.visibleProjects, ["closedcaptioning-cfba8"]);
});

test("reports blocked-project-permissions when functions access is denied", async () => {
  const result = await checkCloudProjectAccess({
    projectId: "flux-training-mvp",
    execFileImpl: async (_command, args) => {
      if (args.includes("projects:list")) {
        return {
          stdout: JSON.stringify({ result: [{ projectId: "flux-training-mvp" }] }),
          stderr: "",
        };
      }
      const error = new Error("denied");
      error.stdout = "";
      error.stderr = "HTTP Error: 403, Permission denied";
      throw error;
    },
    now: () => "2026-03-08T20:55:00.000Z",
  });

  assert.equal(result.status, "blocked-project-permissions");
  assert.equal(result.errorCode, "functions_access_denied");
});

test("reports blocked-cloud-functions-api-disabled when the project exists but the api is disabled", async () => {
  const result = await checkCloudProjectAccess({
    projectId: "flux-training-mvp",
    execFileImpl: async (_command, args) => {
      if (args.includes("projects:list")) {
        return {
          stdout: JSON.stringify({ result: [{ projectId: "flux-training-mvp" }] }),
          stderr: "",
        };
      }
      const error = new Error("service disabled");
      error.stdout = "";
      error.stderr =
        "403 Cloud Functions API has not been used in project flux-training-mvp before or it is disabled. SERVICE_DISABLED cloudfunctions.googleapis.com";
      throw error;
    },
    now: () => "2026-03-08T20:55:00.000Z",
  });

  assert.equal(result.status, "blocked-cloud-functions-api-disabled");
  assert.equal(result.errorCode, "cloud_functions_api_disabled");
});

test("reports ready when project is visible and functions list succeeds", async () => {
  const result = await checkCloudProjectAccess({
    projectId: "flux-training-mvp",
    execFileImpl: async (_command, args) => {
      if (args.includes("projects:list")) {
        return {
          stdout: JSON.stringify({ result: [{ projectId: "flux-training-mvp" }] }),
          stderr: "",
        };
      }
      return {
        stdout: JSON.stringify({ result: [] }),
        stderr: "",
      };
    },
    now: () => "2026-03-08T20:55:00.000Z",
  });

  assert.equal(result.status, "ready");
  assert.deepEqual(result.visibleProjects, ["flux-training-mvp"]);
});
