#!/bin/bash

set -xe

# Restore all git changes
git restore -s@ -SW  -- packages

# Build first, while package.json still matches the lockfile and packages'
# self-references (e.g. `@nuxt/devtools-kit/types`) still resolve to
# themselves. Bumping first breaks both: pnpm's run-time lockfile check
# rejects the rewritten workspace deps, and renamed self-references no
# longer resolve during the build.
pnpm build

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
for p in packages/* ; do
  pushd $p
  echo "Publishing $p"
  cp ../../LICENSE .
  cp ../../README.md .
  pnpm publish --access public --no-git-checks --tag latest
  popd
done
