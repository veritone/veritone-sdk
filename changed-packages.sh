#!/usr/bin/env bash
# look at paths of staged files, second path segment (remove "packages"),
# filter empty lines (files in root)
git diff --name-only --cached | awk -F/ '{print $(2)}' | sed '/^\s*$/d' | uniq | tee >(xargs wsrun $1 lint) >(xargs wsrun $1 test) | wait $1 $2
