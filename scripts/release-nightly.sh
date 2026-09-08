#!/bin/bash

set -xe

# Restore all git changes
git restore -s@ -SW  -- packages

# Bump versions to nightly
pnpm jiti ./scripts/bump-nightly

# Update token
if [[ ! -z ${NODE_AUTH_TOKEN} ]] ; then
  echo "//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}" >> ~/.npmrc
  echo "registry=https://registry.npmjs.org/" >> ~/.npmrc
  echo "always-auth=true" >> ~/.npmrc
  npm whoami
fi

# Release packages
# One package failing to publish (e.g. a brand-new package pending npm
# trusted-publisher setup) must not stop the rest from publishing.
failed=()
for p in packages/* ; do
  pushd $p
  echo "Publishing $p"
  cp ../../LICENSE .
  cp ../../README.md .
  if ! pnpm publish --access public --no-git-checks --tag latest; then
    failed+=("$p")
  fi
  popd
done

if [[ ${#failed[@]} -gt 0 ]]; then
  echo "Failed to publish: ${failed[*]}" >&2
  exit 1
fi
