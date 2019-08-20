#!/usr/bin/env bash

cd packages/veritone-json-schemas

yarn
yarn test
yarn build

mkdir public
echo "It worked!" >> public/index.html
