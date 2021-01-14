#!/bin/sh

# Install workspace dependencies
yarn install

# build workspace
yarn build

# bundle lambda layer
yarn layer

# deploy
yarn --cwd infra deploy