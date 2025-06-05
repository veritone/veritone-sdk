#!/usr/bin/env bash

yarn
yarn test
yarn build

mkdir -p dist/schemas
cp schemas/*/*.json dist/schemas
