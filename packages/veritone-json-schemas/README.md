# veritone-json-schemas

This repo contains all the static JSON schemas used by Veritone.
This does **not** include 
[user-defined schemas created through the aiWARE Resource Center](https://support.veritone.com/s/article/000004213?language=en_US),
just the ones that are core to our platform.

## Changing AION schema

For documentation on how to manage and update this package, please see the Confluence page [How
To: Update AION Schema](https://veritone.atlassian.net/wiki/spaces/VP/pages/4232249479/How+To+Update+AION+Schema)

## Testing

See
https://veritone.atlassian.net/wiki/spaces/VP/pages/4232249479/How+To+Update+AION+Schema#Testing

## Publishing

See
https://veritone.atlassian.net/wiki/spaces/VP/pages/4232249479/How+To+Update+AION+Schema#Publishing


## Usage

### Validating a JSON file

Please see the "Validation" section at https://get.aiware.com/schemas/v2/index.html

### Validation with Node.js

This package exports a map of valid validation contract names to their validating functions and looks like the following:

```
	{
		VALIDATORS: {
		  "transcript": validateTranscript
		  "object: validateObject
          ...
    },
    validateTranscript: fn(),
    validateObject: fn(),
    ...
	}
```

It also outputs all the json-schemas and the valid and invalid examples used in our tests for
reference and use in non-javascript contexts.


> **PLEASE NOTE that the json-schema validation ecosystem is not 100% compatible.**
> Different json-schema parsers and validators may behave slightly differently.
> At Veritone, we use [`ajv`](https://www.npmjs.com/package/ajv) which works great with the draft-07 json-schemas we've written.
> If you use another package to parse our json-schemas, hopefully things will "just work" but don't be surprised if there's a few quirks.

## Local Testing

### Creating tests

Create a test in the `examples` or `invalid-examples` directory. Everything in the `examples`
directory must be a valid JSON instance of the schema it is associated with. Everything in the
`invalid-examples` directory must be a JSON instance that fails validation with the associated
schema. 

The typical naming convention is `<category-in-kabob-case>_<description-in-kabob-case>`. Specific
examples that test contract validation should start with `cc-` for Capability Contracts and `oc-`
for Object Contracts.

Each example should start with a `$schema` for the relevant version of the example, an `$id`
with the file path, and a
`$comment` describing what this file is an example of:

```json
{
   "$schema": "https://get.aiware.com/schemas/v2/aion/schema.json",
   "$id": "https://get.aiware.com/schemas/v2/aion/examples/transcription_words-missing.json",
   "$comment": "A transcription that is missing words",
   ...
}
```

In addition, if you want an example to be uploaded to the public schema page, then the example document must 
contain an `"$example"` property that contains the title of the example, and the `"$comment"` will become
the description of the example.

```
  "$example": "Audio transcription with disfluency detectaion",
  "$comment": "Disfluencies are non-word sounds like "um", "uh", coughs and sneezes.",
```

### Running tests

We use a containerized tool for validation of the schema and examples. All examples can be
tested easily with `make test`, however sometimes it is easier to focus on a subset of examples,
so the following can also be used:

### Test a schema

To run a suite of tests for one schema, run `./scripts/test-examples.sh <schema-name>`

In this mode, the test script will verify the schema itself is valid. It will then assert that
all JSON files in the `examples` directory validate against the schema correctly. It will then
assert that all JSON files in the `invalid-examples` directory DO NOT validate against the schema.

```bash
$ ./test-examples.sh v1 language
ok     master.json
ok     language/language.json
ok     language/examples/basic.json
ok     language/invalid-examples/empty.json
ok     language/invalid-examples/missing-language.json
ok     language/invalid-examples/missing-validation-contract.json```
```

### Test a specific example file

To run a single test for one JSON file in an example directory, run `./scripts/test-examples.sh <partial-file-path>`

In this mode, the only the one file will be validated.

```bash
$ ./test-examples.sh schemas/v1/language/examples/basic.json
ok     language/examples/basic.json
PASS   1 tests passed
```

### Test any JSON file

To run a single test for one JSON file, ues a full path `./scripts/test-examples.sh <any-file-path>`

In this mode, the only the one file will be validated.

```bash
$ ./test-examples.sh /Users/kmurray/tmp/foobar.json
ok     /Users/kmurray/tmp/foobar.json
PASS   1 tests passed
```

### Validate directly with the container sourcemeta/jsonschema

Validate one or more schemas against the jsonschema metadata schema validators with the
`metaschema` keyword:

```bash
docker run --interactive --rm --volume "$PWD:/workspace" \
  ghcr.io/sourcemeta/jsonschema \
  metaschema --verbose \
  schemas/master.json schemas/aion/aion.json
```

Validate one or more instances against a schema with the `validate` keyword by passing in the
schema as the first parameter and the instance file as the 2nd. Note that you must also
include the `$ref`d files as resources (`-r` parameters). The following validates the
`examples/basic.json` instance file against the `language.json` schema

Note that this is very much like just running `./scripts/test-examples-sh <any-file-path>`, but
may give you more control over the validation parameters.

```bash
docker run --interactive --rm --volume "$PWD:/workspace" \
  ghcr.io/sourcemeta/jsonschema \
  validate --verbose \
  -r schemas/master.json \
  schemas/language/language.json \
  schemas/language/examples/basic.json
```

## Contributing

See the [veritone-sdk README](../../README.md) for full information, and the "How To" article
https://veritone.atlassian.net/wiki/spaces/VP/pages/4232249479/How+To+Update+AION+Schema#Testing
for specific information about the veritone-json-schemas package


### Local Development

To just run the full suite of tests, use `make test`

1. `yarn install` to install dependencies.
2. run `yarn test` to run the schema validator against all the examples.

### To add a new object type

See https://veritone.atlassian.net/wiki/spaces/VP/pages/4232249479/How+To+Update+AION+Schema

## License

Copyright 2019-2025, Veritone Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
