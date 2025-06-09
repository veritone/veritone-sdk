#!/usr/bin/env bash

appDir=$(dirname "$0")

cd "$appDir"

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

# validates any number of files against a schema. automatically includes a reference to the
# master document.
#  $1 schemaName to validate against
#  $2... files to validate
jsValidate() {
  local schemaName=$1
  local instanceFiles=$2

  # sourcemeta/jsonschema
  docker run --interactive --rm --volume "$PWD:/workspace" \
    ghcr.io/sourcemeta/jsonschema validate --verbose --fast \
    ./schemas/$schemaName/$schemaName.json \
    -r ./schemas/master.json \
    $instanceFiles \
    2>&1

}

# validates that the schema itself is valid according to it's $schema value
jsMetaValidate() {
  local schemaName=$1

  # validate the master schema that contains the definitions
  docker run --interactive --rm --volume "$PWD:/workspace" \
    ghcr.io/sourcemeta/jsonschema metaschema --verbose \
    /workspace/schemas/master.json \
    2>&1
  # validate the root schema
  docker run --interactive --rm --volume "$PWD:/workspace" \
    ghcr.io/sourcemeta/jsonschema metaschema --verbose \
    /workspace/schemas/$schemaName/$schemaName.json \
    2>&1
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
    testName=$(echo "$line" | sed 's|^.*: ||;s|/workspace/schemas/||')
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

# given a schema name, will validate that the schema itself is valid
#  $1 - name of the schema: aion, summary, object, etc
validateMetaSchema() {
  local schema=$1

  local results=$(jsMetaValidate $schema)
  evaluateTestResults true "$results"
}

# given a schema name, will validate that all the "examples" are valid. Returns 0 (success) if
# all examples are valid.
#  $1 - name of the schema: aion, summary, object, etc
validateSchemaExamples() {
  local schema=$1

  [[ -d ./schemas/$schema/examples ]] || {
    reportTest "(no examples)" "-"
    return
  }

  # run all the tests and collect the results
  local results
  results=$(jsValidate "$schema" "./schemas/$schema/examples/*.json")
  evaluateTestResults true "$results"
}

# given a schema name, will validate that all the "invalid-examples" are invalid. Returns 0 (success) if
# all examples are invalid.
#  $1 - name of the schema: aion, summary, object, etc
validateSchemaInvalidExamples() {
  local schema=$1

  [[ -d ./schemas/$schema/invalid-examples ]] || {
    reportTest "(no invalid-examples)" "-"
    return
  }

  # run all the tests in one batch (for performance) and collect the results
  local results
  results=$(jsValidate "$schema" "./schemas/$schema/invalid-examples/*.json")
  evaluateTestResults false "$results" 
}

# given a schema name, validates that all "examples" are valid and all "invalid-examples" are
# invalid. Returns 0 if everything tests out ok, 1 otherwise.
#  $1 - name of the schema: aion, summary, object, etc
validateSchema() {
  local schema=$1

  # validate the schema itself
  validateMetaSchema $schema || return 1

  # printf "Schema %s\n" $schema
  validateSchemaExamples $schema
  validateSchemaInvalidExamples $schema
  return 0
}

validateFile() {
  # get file like ./schemas/aion/examples/empty.json
  local filePath="./schemas/$(echo "$1" | sed 's|^.*schemas/||')"

  # extract schema from file path as 3rd element
  local schemaName=$(echo "$filePath" | cut -d/ -f3)

  local results
  results=$(jsValidate "$schemaName" "$filePath")

  case "$filePath" in
    *invalid-examples*)  evaluateTestResults false "$results";;
    *)                   evaluateTestResults true  "$results";;
  esac
}

# main
# Run all the tests, exit with 0 (success) if all pass, or 1 (failure) otherwise
{
  echo 0 >/tmp/schematest.pass.txt
  echo 0 >/tmp/schematest.fail.txt

  skipGeneralValidation=false
  verbose=false
  while [[ "$1" ]]; do
    case "$1" in
    -v|--verbose) verbose=true;;
    -h|--help)    usage; exit 0;;
    *.json)
      # validate a single file that the user provided
      skipGeneralValidation=true
      validateFile "$1"
      ;;
    *)
      # validate a single schema that the user provided
      skipGeneralValidation=true
      schemaName=$1
      [[ -d ./schemas/$schemaName ]] || {
        echo "Unable to find schema '$schemaName'" >>/dev/stderr
        exit 1
      }
      validateSchema $schemaName
      ;;
    esac
    shift
  done

  $skipGeneralValidation || {
    # validate all files of all schemas
    for schemaPath in ./schemas/*/*.json; do
      schemaName=$(echo "$(basename "$schemaPath")" | sed 's/.json//')
      validateSchema $schemaName
    done
  }

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