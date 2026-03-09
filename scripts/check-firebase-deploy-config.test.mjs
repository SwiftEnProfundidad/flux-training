import test from "node:test";
import assert from "node:assert/strict";

import { evaluateFirebaseDeployConfig } from "./check-firebase-deploy-config.mjs";

test("evaluateFirebaseDeployConfig returns ready for valid deploy config", async () => {
  const result = await evaluateFirebaseDeployConfig({
    firebaseConfig: {
      functions: [
        {
          source: "apps/backend",
          codebase: "backend",
          runtime: "nodejs20"
        }
      ]
    },
    firebaseRc: {
      projects: {
        default: "flux-training-mvp"
      }
    },
    backendPackage: {
      main: "dist/index.js",
      engines: { node: "20" },
      scripts: { build: "esbuild src/index.ts --bundle --outfile=dist/index.js" }
    },
    backendDistExists: true
  });

  assert.equal(result.status, "ready");
  assert.equal(result.backendDistExists, true);
});

test("evaluateFirebaseDeployConfig reports mismatches", async () => {
  const result = await evaluateFirebaseDeployConfig({
    firebaseConfig: {
      functions: [
        {
          source: "backend",
          codebase: "default",
          runtime: "nodejs18"
        }
      ]
    },
    firebaseRc: {
      projects: {
        default: "wrong-project"
      }
    },
    backendPackage: {
      main: "lib/index.js",
      engines: { node: "18" },
      scripts: { build: "tsc -p tsconfig.json" }
    },
    backendDistExists: false
  });

  assert.equal(result.status, "blocked-invalid-firebase-deploy-config");
  assert.deepEqual(result.blockers, [
    "default-project-mismatch",
    "functions-source-mismatch",
    "functions-codebase-mismatch",
    "functions-runtime-mismatch",
    "backend-main-mismatch",
    "backend-node-engine-mismatch",
    "backend-build-not-bundled"
  ]);
});
