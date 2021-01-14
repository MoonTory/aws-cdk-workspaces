#!/bin/sh

# Install Yarn workspace dependencies to Lambda Layer directory
yarn install --flat --modules-folder lambda-layer/nodejs/node_modules --no-progress --non-interactive --production --silent

# Remove workspace directories from Lambda Layer node_modules
# to prevent circular references
rm -rf \
  lambda-layer/nodejs/node_modules/.bin \
  lambda-layer/nodejs/node_modules/infra \
  lambda-layer/nodejs/node_modules/@aws-cdk-workspaces \
  lambda-layer/nodejs/node_modules/services/posts \
  lambda-layer/nodejs/node_modules/packages/mongo-utils

# Copy common utilities
cp -r packages/mongo-utils/build/ lambda-layer/nodejs/mongo-utils
echo '{"main": "index.js"}' > lambda-layer/nodejs/mongo-utils/package.json

cp -r packages/models/build/ lambda-layer/nodejs/models
echo '{"main": "index.js"}' > lambda-layer/nodejs/models/package.json