#!/usr/bin/env bash

yarn
yarn test
yarn build

mkdir -p dist/schemas/vtn-standard
cp schemas/vtn-standard/*/*.json dist/schemas/vtn-standard
