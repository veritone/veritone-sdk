#!/usr/bin/env bash

#shopt -s nullglob
for dir in ./packages/*;do
t=$(echo $dir | sed -e "s/\.\/packages\///g")
yarn workspace $t run build &
done
wait
