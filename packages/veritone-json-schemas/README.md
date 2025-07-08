# veritone-json-schemas

This repo contains all the static JSON schemas used by Veritone.
This does **not** include 
[user-defined schemas created through the aiWARE Resource Center](https://support.veritone.com/s/article/000004213?language=en_US),
just the ones that are core to our platform.

## Changin AION schema

For documentation on how to manage and update this package, please see the Confluence page [How
To: Update AION Schema](https://veritone.atlassian.net/wiki/spaces/VP/pages/4232249479/How+To+Update+AION+Schema)





## Publishing

Once you have updated the 

The JSON schema is deployed to the get.aiware.com
site (https://get.aiware.com/schemas/index.html). 
This may be deployed manually with
```bash
AWS_PROFILE=default
aws --profile=$AWS_PROFILE s3 cp schemas/vtn-standard/index.html s3://aiware-prod-public/schemas/index.html
for schema in $(find schemas -name '*.json' | grep -v "examples"); do
  aws --profile=$AWS_PROFILE s3 cp --dryrun $schema s3://aiware-prod-public/$schema}
done
```
(with appropriate updates for the local directory)

## Usage

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

It also outputs all the json-schemas and the valid and invalid examples used in our tests for reference and use in non-javascript contexts.

> **PLEASE NOTE that the json-schema validation ecosystem is not 100% compatible.**
> Different json-schema parsers and validators may behave slightly differently.
> At Veritone, we use [`ajv`](https://www.npmjs.com/package/ajv) which works great with the draft-07 json-schemas we've written.
> If you use another package to parse our json-schemas, hopefully things will "just work" but don't be surprised if there's a few quirks.

## AI Object Notation (AION)

The AION validator is in a different class than the other validators. Most validators are tied to the `validationContracts`
value and are for validating a file for a specific capability like transcription, concepts, object detection, etc. In contrast
the AION validator will validate an entire file regardless of what specific types of data it represents. Just because a 
file is a valid AION file does not automatically make it valid for any given capability as different capabilities require
specific fields for that capability. For instance, a transcription file **MUST** contain a `series` of `words` to be valid,
but an AION file only **MAY** contain a series of words. Being a valid AION file is _necessary_ for a capability but not 
_sufficient_ for a capability.

So what is the AION validator for then? It has two purposes:
1. It enforces a schema that validates any `application/vnd.veritone.aion+json` Media Type file (f.k.a. MIME Types). 
   See [IANA's list of Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml) for details.
2. It can be used for any "vtn-standard" file, even those for which a specific validation contract is not available. 
   For instance, at the time of writing, there is no specific validation contract for validating "location detection", 
   but you can use the AION validator to ensure that your GPS data conforms to the expected format.


## Local Testing

### Creating tests

Create a test in the `examples` or `invalid-examples` directory. Everything in the `examples`
directory must be a valid JSON instance of the schema it is associated with. Everything in the
`invalid-examples` directory must be a JSON instnace that fails validation with the associated
schema. 

The typical naming convention is `<category-in-kabob-case>_<description-in-kabob-case>`. Specific
examples that test contract validation should start with `cc` for Capability Contracts and `oc`
for Object Contracts.

Each example should start with a `$schema` for the relevant version of the example, and a
`$comment` describing what this file is an example of:

```
{
   "$schema": "https://get.aiware.com/schemas/v2/aion/schema.json",
   "$comment": "A transcription that is missing words",
   ...
}

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

To run a suite of tests for one schema, run `./test-examples.sh <schema-name>`

In this mode, the test script will verify the schema itself is valid. It will then assert that
all JSON files in the `examples` directory validate against the schema correctly. It will then
assert that all JSON files in the `invalid-examples` directory DO NOT validate against the schema.

```
$ ./test-examples.sh language
ok     master.json
ok     language/language.json
ok     language/examples/basic.json
ok     language/invalid-examples/empty.json
ok     language/invalid-examples/missing-language.json
ok     language/invalid-examples/missing-validation-contract.json```
```

### Test a specific file

To run a single test for one JSON file, run `./test-examples.sh <file-path>`

In this mode, the only the one file will be validated.

```
$ ./test-examples.sh language/examples/basic.json
ok     language/examples/basic.json
PASS   1 tests passed
```

### Validate directly with the container sourcemeta/jsonschema

Validate one or more schemas against the jsonschema metadata schema validators with the
`metaschema` keyword:

```
docker run --interactive --rm --volume "$PWD:/workspace" \
  ghcr.io/sourcemeta/jsonschema \
  metaschema --verbose \
  schemas/master.json schemas/aion/aion.json
```

Validate one or more instances against a schema with the `validate` keyword by passing in the
schema as the first parameter and the instance file as the 2nd. Note that you must also
include the `$ref`d files as resources (`-r` parameters). The following validates the
`examples/basic.json` instance file against the `language.json` schema

```
docker run --interactive --rm --volume "$PWD:/workspace" \
  ghcr.io/sourcemeta/jsonschema \
  validate --verbose \
  -r schemas/master.json \
  schemas/language/language.json \
  schemas/language/examples/basic.json
```

## Contributing

> See the [veritone-sdk README](../../README.md) for full information.

### Local Development

1. `yarn install` to install dependencies.
2. run `yarn test` to run the schema validator against all the examples.

### To add a new object type

1. Add new enum to the `objectResultsType` field
2. Add new structure for the object type
3. Add new Object Contract to the contracts.json file

## License

Copyright 2019-2021, Veritone Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
