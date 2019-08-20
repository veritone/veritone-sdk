#!/usr/bin/env bash

yarn build && yarn test

mkdir public
echo "It worked!" >> public/index.html
