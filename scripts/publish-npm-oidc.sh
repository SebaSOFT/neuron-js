#!/usr/bin/env bash
set -euo pipefail

PACKAGE_NAME="$(node -p "require('./package.json').name")"
PACKAGE_VERSION="$(node -p "require('./package.json').version")"

# changesets/action v2 passes the output file path via CHANGESETS_OUTPUT.
# When set, publish events must be appended as ndjson lines:
#   {"type":"git-tag","tag":"vX.Y.Z","packageName":"<name>"}
# The action then pushes the tag and (with create-github-releases) creates
# the GitHub Release. Without this, the action only warns and skips tags.
if [[ -n "${CHANGESETS_OUTPUT:-}" ]]; then
  if npm view "${PACKAGE_NAME}@${PACKAGE_VERSION}" version >/dev/null 2>&1; then
    echo "${PACKAGE_NAME}@${PACKAGE_VERSION} is already published; skipping npm publish."
    # Already-published versions keep their tag: report it so the action can
    # (re)create the tag/ref if it is missing instead of silently skipping.
    printf '{"type":"git-tag","tag":"v%s","packageName":"%s"}\n' \
      "${PACKAGE_VERSION}" "${PACKAGE_NAME}" >>"${CHANGESETS_OUTPUT}"
    exit 0
  fi

  echo "Publishing ${PACKAGE_NAME}@${PACKAGE_VERSION} with npm trusted publishing."
  npm publish --access public --provenance

  printf '{"type":"git-tag","tag":"v%s","packageName":"%s"}\n' \
    "${PACKAGE_VERSION}" "${PACKAGE_NAME}" >>"${CHANGESETS_OUTPUT}"
  exit 0
fi

# Fallback for manual local runs (no action environment): create the tag here.
if npm view "${PACKAGE_NAME}@${PACKAGE_VERSION}" version >/dev/null 2>&1; then
  echo "${PACKAGE_NAME}@${PACKAGE_VERSION} is already published; skipping npm publish."
  exit 0
fi

echo "Publishing ${PACKAGE_NAME}@${PACKAGE_VERSION} with npm trusted publishing."
npm publish --access public --provenance

git tag "v${PACKAGE_VERSION}"
