#!/usr/bin/env bash

for dir in ./packages/*;do
d=$(basename $dir)
yarn workspace $d run build &
done
wait
