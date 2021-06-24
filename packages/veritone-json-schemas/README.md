# veritone-json-schemas

This repo contains all the static JSON schemas used by Veritone.
This does **not** include the [user-defined schemas registered through Veritone Developer](https://docs.veritone.com/#/developer/data/),
just the ones that are core to our platform.

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
> And we try to keep our schemas simple and not use too many advanced features to increase the chance of compatibility with other packages.
> So if you do use another package to parse our json-schemas, hopefully things will "just work" but don't be surprised if there's a few quirks.

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

## Contributing

> See the [veritone-sdk README](../../README.md) for full information.

### Local Development

1. `yarn install` to install dependencies.
2. run `yarn test` to run the schema validator against all the examples.

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
