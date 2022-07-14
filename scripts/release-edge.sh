#!/bin/bash

# Temporary forked from nuxt/framework

set -xe

# Bump versions to edge
node ./scripts/bump-edge.mjs

# Update token
if [[ ! -z ${NODE_AUTH_TOKEN} ]] ; then
  echo "//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}" >> ~/.npmrc
  echo "registry=https://registry.npmjs.org/" >> ~/.npmrc
  echo "always-auth=true" >> ~/.npmrc
  echo "npmAuthToken: ${NODE_AUTH_TOKEN}" >> ~/.yarnrc.yml
  npm whoami
fi

# Release packages
echo "Publishing package..."
npm publish --access public --tolerate-republish
