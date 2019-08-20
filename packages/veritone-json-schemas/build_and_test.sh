#!/usr/bin/env bash

yarn
yarn build
yarn test

mkdir public
echo "It worked!" >> public/index.html
