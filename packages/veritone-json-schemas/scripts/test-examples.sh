#!/usr/bin/env bash

appDir=$(dirname "$(realpath "$0")")
pkgDir=$(dirname "$appDir")

cd "$pkgDir"

usage() {
  cat <<EOT
USAGE:
  $(basename "$0")
      Runs all tests for all schemas in the schemas directory

  $(basename "$0") schema-name
      Runs all tests for the specified schema in the schemas directory. Ex: 'transcript'

  $(basename "$0") example-file
      Runs the single test provided in the schemas directory. Ex: 'transcript/examples/confidence.json'

OPTIONS
  -h, --help
      Display this usage statement.
  -v, --verbose
      Display the errors even for tests that are expected to be invalid. Default is to only display
      errors for tests that are expected to be valid.
EOT
}

# validates any number of files against a schema. automatically includes a reference to
# referenced documents (master and contracts) when needed.
#  $1 schema version to validate against, like v1, v2, etc
#  $2 schema name to validate against, like aion, summary, object, etc
#  $3, $4, ... files to validate
jsValidate() {
  local sVer=$1
  local sName=$2
  shift 2

  # running in fast mode means that we don't output the full validation stack, but only the
  # error string, so only use fast if not in verbose mode
  local doFast="--fast"
  if $verbose; then
    doFast=""
  fi

  case "$sVer" in
    v1)
      docker run --interactive --rm --volume "$PWD:/workspace" \
        ghcr.io/sourcemeta/jsonschema validate --verbose $doFast \
        ./schemas/$sVer/$sName/$sName.json \
        -r ./schemas/$sVer/master.json \
        "$@" \
        2>&1
      ;;
    v2)
      docker run --interactive --rm --volume "$PWD:/workspace" \
        ghcr.io/sourcemeta/jsonschema validate --verbose $doFast \
        ./schemas/$sVer/$sName/schema \
        -r ./schemas/$sVer/master.json \
        -r ./schemas/$sVer/contracts.json \
        "$@" \
        2>&1
      ;;
    *)
      echo "Unknown schema version '$sVer'" >&2
      exit 1
      ;;
  esac
}

# validates that the schema itself is valid according to it's $schema value. This will validate
# not only the schema itself, but also supporting schemas like master and contracts (if appropriate).
#  $1 - schema version: v1, v2, etc
#  $2 - schema name: aion, summary, object, etc
#
# To keep track of which scehmas have already been validated, we will write them to the tmp file 
# /tmp/schematest.validated.txt
jsMetaValidate() {
  local sVer=$1
  local sName=$2

  # different versions have different referenced schemas, so make a list of all the schemas that
  # we need to validate for this version
  local schemas
  case "$sVer" in
    v1)
      schemas="./schemas/v1/master.json \
               ./schemas/v1/$sName/$sName.json"
      ;;
    v2)
      schemas="./schemas/v2/master.json \
               ./schemas/v2/contracts.json"
      if [[ -f ./schemas/v2/$sName/schema ]]; then
        schemas+=" ./schemas/v2/$sName/schema"
      else
        schemas+=" ./schemas/v2/$sName/schema.json"
      fi
      ;;
    *)
      echo "Unknown schema version '$sVer'" >&2
      exit 1
      ;;
  esac


  local schemaPath
  for schemaPath in $schemas; do
    # exists?
    [[ -f "$schemaPath" ]] || {
      echo "fail: $schemaPath"
      echo "error: Schema file not found: $schemaPath"
      continue
    }

    # already validated?
    grep -q "$schemaPath" /tmp/schematest.validated.txt && {
      # echo "ok: $schemaPath (already validated)"
      continue
    }

    docker run --interactive --rm --volume "$PWD:/workspace" \
      ghcr.io/sourcemeta/jsonschema metaschema --verbose \
      "$schemaPath" \
      2>&1

    # add to the file of validated schemas
    echo "$schemaPath" >>/tmp/schematest.validated.txt
  done
}

# outputs the result of one test
#  $1 - test name
#  $2 - test result (ok, fail, etc)
reportTest() {
  printf "%-6s %s\n" "$2" "$1"
}

# given the output of the validation run, prints a table of passed and failed tests.
#
# If the test is expected to be valid, but fails, then the error that made the test invalid will
# be output. If the test is expected to be invalid, then the error will only be output if the
# verbose flag is true
#
#  $1 expect result of these tests to be valid: true or false
#  $2 output of the validation code
#  updates the number of passed tests in /tmp/schematest.pass.txt
#  updates the number of failed tests in /tmp/schematest.fail.txt
#  returns 0 if all tests pass, 1 if any test fails
#
# Example output from the container that we will be evaluating:
#  ok: /workspace/schemas/aion/examples/correlaton.json
#    matches /workspace/schemas/aion/aion.json
#  ok: /workspace/schemas/aion/examples/documentation-sample.json
#    matches /workspace/schemas/aion/aion.json
#  fail: /workspace/schemas/aion/invalid-examples/series-words_no-confidence.json
#  error: Schema validation failure
#    The object value was expected to define properties "confidence", and "utteranceLength" but did not define properties "confidence", and "utteranceLength"
#      at instance location "/series/0/words/0"
#      at evaluate path "/allOf/3/properties/series/$ref/items/$ref/properties/words/$ref/allOf/1/then/items/required"
#  fail: /workspace/schemas/aion/invalid-examples/series-words_no-word.json
#  error: Schema validation failure
#    The array value was expected to contain at least 1 item but it contained 0 items
#      at instance location "/series/0/words"
#      at evaluate path "/allOf/3/properties/series/$ref/items/$ref/properties/words/$ref/allOf/0/minItems"
evaluateTestResults() {
  local expectValid="$1"
  local results="$2"

  local pass=$(< /tmp/schematest.pass.txt)
  local fail=$(< /tmp/schematest.fail.txt)

  IFS=$'\n'
  local line
  local testName
  local printLine=true
  for line in $results; do
    testName=$(echo "$line" | sed 's|^.*: ||;s|/workspace/||')
    case "$line" in
      Detecting*) : ;;
      Importing*) : ;;
      ok:*)
        if $expectValid; then
          reportTest "$testName" ok
          pass=$(( $pass + 1 ))
          printLine=false
        else
          reportTest "$testName" fail
          fail=$(( $fail + 1 ))
          printLine=true
        fi
        ;;
      fail:*)
        if $expectValid; then
          reportTest "$testName" fail
          fail=$(( $fail + 1 ))
          printLine=true
        else
          reportTest "$testName" ok
          pass=$(( $pass + 1 ))
          printLine=$verbose
        fi
        ;;
      *)
        $printLine && printf "       %s\n" "$line"
        ;;
    esac
  done
  IFS=$' \t\n'

  echo "${pass:-0}" >/tmp/schematest.pass.txt
  echo "${fail:-0}" >/tmp/schematest.fail.txt

  # return 0 if no failing tests
  [[ $fail -eq 0 ]]
}

# given a schema version and  name, will validate that the schema itself is valid
#  $1 - version of the schema: v1, v2, etc
#  $2 - name of the schema: aion, summary, object, etc
validateMetaSchema() {
  local sVer=$1
  local sName=$2

  local results=$(jsMetaValidate "$sVer" "$sName")
  evaluateTestResults true "$results"
}

# given a schema name, will validate that all the "examples" are valid. Returns 0 (success) if
# all examples are valid.
#  $1 - version of the schema: v1, v2, etc
#  $2 - name of the schema: aion, summary, object, etc
validateSchemaExamples() {
  local sVer=$1
  local sName=$2

  [[ -d ./schemas/$sVer/$sName/examples ]] || {
    reportTest "(no examples)" "-"
    return 0
  }

  # run all the tests and collect the results
  local results
  results=$(jsValidate "$sVer" "$sName" ./schemas/$sVer/$sName/examples/*.json)
  evaluateTestResults true "$results"
}

# given a schema name, will validate that all the "invalid-examples" are invalid. Returns 0 (success) if
# all examples are invalid.
#  $1 - version of the schema: v1, v2, etc
#  $2 - name of the schema: aion, summary, object, etc
validateSchemaInvalidExamples() {
  local sVer=$1
  local sName=$2

  [[ -d ./schemas/$sVer/$sName/invalid-examples ]] || {
    reportTest "(no invalid-examples)" "-"
    return 0
  }

  # run all the tests in one batch (for performance) and collect the results
  local results
  results=$(jsValidate "$sVer" "$sName" ./schemas/$sVer/$sName/invalid-examples/*.json)
  evaluateTestResults false "$results" 
}

# given a schema name, validates that all "examples" are valid and all "invalid-examples" are
# invalid. Returns 0 if everything tests out ok, 1 otherwise.
#  $1 - path to the schema file to validate, like ./schemas/v1/text/text.json or ./schemas/v2/aion/schema.json
validateSchema() {
  local sPath=$1

  # trim the path to the schema directory
  sPath=$(echo "$sPath" | sed 's|^.*schemas/|./schemas/|')
  # sPath is now like ./schemas/v2/aion/schema.json

  # path is always like ./schemas/v2/aion/schema.json or ./schemas/v1/text/text.json
  local sVer=$(echo "$sPath" | cut -d/ -f3)
  local sName=$(echo "$sPath" | cut -d/ -f4)

  echo "Version $sVer of schema $sName"

  # validate the schema itself
  validateMetaSchema "$sVer" "$sName" || return 1

  # validate the example instances
  validateSchemaExamples "$sVer" "$sName"
  validateSchemaInvalidExamples "$sVer" "$sName"
  return 0
}

# given a schema version, validates all schemas in that version
#  $1 - schema version: v1, v2
validateVersion() {
  local sVer=$1

  # find all schema files in this version and validate them. look for 'schema.json' or just
  # plain 'schema' files
  for schemaPath in $(find ./schemas/$sVer/*/ -type f -maxdepth 1 \( -name '*.json' -o -name 'schema' \) ); do
    validateSchema $schemaPath
  done

}

# validates a single JSON instance file against the schema that is in the parent directory
#  $1 - path to the file to validate, like .../schemas/v1/text/examples/recognized-text.json
validateFile() {
  local iPath="$1"

  # trim the path to the schema directory
  iPath=$(echo "$iPath" | sed 's|^.*schemas/|./schemas/|')
  # iPath is now like ./schemas/v1/text/examples/recognized-text.json
  local sVer=$(echo "$iPath" | cut -d/ -f3)
  local sName=$(echo "$iPath" | cut -d/ -f4)

  local results
  results=$(jsValidate "$sVer" "$sName"  "$iPath")

  case "$iPath" in
    *invalid-examples*)  evaluateTestResults false "$results";;
    *)                   evaluateTestResults true  "$results";;
  esac
}

# main
# Run all the tests, exit with 0 (success) if all pass, or 1 (failure) otherwise
{
  echo 0 >/tmp/schematest.pass.txt
  echo 0 >/tmp/schematest.fail.txt
  echo "" > /tmp/schematest.validated.txt

  schemaVersion=v2
  skipVersionValidation=false
  verbose=false

  checkFile=
  checkSchema=

  while [[ "$1" ]]; do
    case "$1" in
    -v|--verbose) verbose=true;;
    -h|--help)    usage; exit 0;;
    v?)           schemaVersion=$1;;
    *.json)       checkFile="$1";;
    *)            checkSchema="$1";;
    esac
    shift
  done

  if [[ "$checkFile" ]]; then
    # validate a single file that the user provided
    validateFile "$checkFile"
  elif [[ "$checkSchema" ]]; then
    # validate a single schema that the user provided
    if [[ -f ./schemas/$schemaVersion/$checkSchema/$checkSchema.json ]]; then
      validateSchema ./schemas/$schemaVersion/$checkSchema/$checkSchema.json
    elif [[ -f ./schemas/$schemaVersion/$checkSchema/schema.json ]]; then
      validateSchema ./schemas/$schemaVersion/$checkSchema/schema.json
    elif [[ -f ./schemas/$schemaVersion/$checkSchema/schema ]]; then
      validateSchema ./schemas/$schemaVersion/$checkSchema/schema
    else
      # schema file not found
      echo "Unable to find version $schemaVersion of schema '$checkSchema'"
      exit 1
    fi
  else
    validateVersion $schemaVersion
  fi

  pass=$(< /tmp/schematest.pass.txt)
  fail=$(< /tmp/schematest.fail.txt)

  [[ "$fail" -eq 0 ]] && {
    echo "PASS   $pass tests passed"
    exit 0
  }

  echo "FAIL   $fail of $(( $pass + $fail )) tests failed"
  echo "       You can see errors in individual tests with '$(basename "$0") --verbose <test-file-path>'"
  exit 1
}