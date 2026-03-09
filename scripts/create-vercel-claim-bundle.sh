#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_PATH="${1:-${ROOT_DIR}/.tmp/flux-vercel-claim.tgz}"
STAGE_DIR="$(mktemp -d)"
PACKAGE_DIR="${STAGE_DIR}/flux-vercel-claim"

mkdir -p "${PACKAGE_DIR}" "$(dirname "${OUTPUT_PATH}")"

copy_path() {
  local relative_path="$1"
  mkdir -p "${PACKAGE_DIR}/$(dirname "${relative_path}")"
  cp -R "${ROOT_DIR}/${relative_path}" "${PACKAGE_DIR}/${relative_path}"
}

copy_path "package.json"
copy_path "pnpm-lock.yaml"
copy_path "pnpm-workspace.yaml"
copy_path "tsconfig.base.json"
copy_path "vercel.json"
copy_path "api"
copy_path "apps/web/index.html"
copy_path "apps/web/package.json"
copy_path "apps/web/tsconfig.json"
copy_path "apps/web/vite.config.ts"
copy_path "apps/web/public"
copy_path "apps/web/src"
copy_path "apps/backend/package.json"
copy_path "apps/backend/tsconfig.json"
copy_path "apps/backend/src"
copy_path "packages/contracts/package.json"
copy_path "packages/contracts/tsconfig.json"
copy_path "packages/contracts/src"
copy_path "packages/contracts/vitest.config.ts"

(
  cd "${PACKAGE_DIR}"
  tar -czf "${OUTPUT_PATH}" .
)

echo "${OUTPUT_PATH}"
