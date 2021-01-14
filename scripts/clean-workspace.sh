#!/bin/sh

# recursively remove all node_modules directories from the workspace
find . -name node_modules -exec rm -rf {} \;

# recursively remove all build directories from the workspace
find . -name build -exec rm -rf {} \;