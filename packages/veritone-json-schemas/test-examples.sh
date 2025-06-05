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
#  $1 expected result of these tests: "valid" or "invalid"
#  $2 output of the validation code
#  updates the number of passed tests in /tmp/schematest.pass.txt
#  updates the number of failed tests in /tmp/schematest.fail.txt
evaluateTestResults() {
  local expected="$1"
  local results="$2"

  local pass=$(< /tmp/schematest.pass.txt)
  local fail=$(< /tmp/schematest.fail.txt)

  IFS=$'\n'
  local line
  local testName
  for line in $results; do
    testName=$(echo "$line" | sed 's|/data/schemas/||;s| .*$||')
    case "$line" in
      /data/*\ $expected)
        reportTest "$testName" ok
        pass=$(( $pass + 1 ))
        ;;
      /data/*)
        reportTest "$testName" fail
        fail=$(( $fail + 1 ))
        ;;
      *)
        [[ "$expected" == valid ]] || $verbose && printf "       %s\n" "$line"
        ;;
    esac
  done
  IFS=$' \t\n'

  echo "${pass:-0}" >/tmp/schematest.pass.txt
  echo "${fail:-0}" >/tmp/schematest.fail.txt
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

  # run all the tests in one batch (for performance) and collect the results
  local results
  results=$(docker run --rm -v $PWD:/data 3scale/ajv validate --all-errors \
      -s "/data/schemas/$schema/$schema.json" \
      -r "/data/schemas/master.json" \
      -d "/data/schemas/$schema/examples/*.json" 2>&1)
  evaluateTestResults valid "$results" 
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
  results=$(docker run --rm -v $PWD:/data 3scale/ajv validate --all-errors \
      -s "/data/schemas/$schema/$schema.json" \
      -r "/data/schemas/master.json" \
      -d "/data/schemas/$schema/invalid-examples/*.json" 2>&1)
  evaluateTestResults invalid "$results" 
}

# given a schema name, validates that all "examples" are valid and all "invalid-examples" are
# invalid. Returns 0 if everything tests out ok, 1 otherwise.
#  $1 - name of the schema: aion, summary, object, etc
validateSchema() {
  local schema=$1

  # printf "Schema %s\n" $schema
  validateSchemaExamples $schema
  validateSchemaInvalidExamples $schema
}

validateFile() {
  local filePath="/data/schemas/$(echo "$1" | sed 's|^.*schemas/||')"

  local schema=$(echo "$filePath" | cut -d/ -f4)

  local results
  results=$(docker run --rm -v $PWD:/data 3scale/ajv validate --all-errors \
      -s "/data/schemas/$schema/$schema.json" \
      -r "/data/schemas/master.json" \
      -d "$filePath" 2>&1)

  case "$filePath" in
    *invalid-examples*)  evaluateTestResults invalid "$results";;
    *)                   evaluateTestResults valid "$results";;
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