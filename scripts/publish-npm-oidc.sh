#!/usr/bin/env bash
set -euo pipefail

PACKAGE_NAME="$(node -p "require('./package.json').name")"
PACKAGE_VERSION="$(node -p "require('./package.json').version")"

if npm view "${PACKAGE_NAME}@${PACKAGE_VERSION}" version >/dev/null 2>&1; then
  echo "${PACKAGE_NAME}@${PACKAGE_VERSION} is already published; skipping npm publish."
  exit 0
fi

echo "Publishing ${PACKAGE_NAME}@${PACKAGE_VERSION} with npm trusted publishing."
npm publish --access public --provenance

# changesets/action watches stdout for this marker on root packages, then creates
# the corresponding git tag and GitHub Release.
echo "New tag: v${PACKAGE_VERSION}"
