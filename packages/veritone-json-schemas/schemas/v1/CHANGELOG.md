# veritone-json-schemas changelog

## Version 0.1.0
* initial version published to NPM

## Version 0.1.1
* export a map of the validation contracts to the validation functions as VALIDATOR
* basic README.md
* cleanup for object validation contract

## Version 0.1.2
* fix VALIDATORS export

## Version 0.1.3
* revise TRANSCRIPT validator to make words optional
* add { processed: } to positive validations to show only the processed fields
* dynamic test loader
* empty words are no longer valid

## Version 0.1.4
* Fix { processed } for transcript.
* More tests, addd vtn-standard headers to transcript

## Version 0.1.5
* Change GUIDS from number to string
* Some minor changes in descriptions

## Version 0.1.6
* Changes to type enum in series / object results
* Support for object recognition/detection
* More examples for transcript

## Version 0.1.7
* Make object required if a series array is present
* Add test cases to prevent empty objects in summaries
* Add test case to make sure that an empty object summary with no recognition/detection is a valid result.

## Version 1.0.0
* **BREAKING CHANGE** Adds new restrictions to existing `object` and `transcription` validation contracts that caused 
  some previously valid examples to now be categorized as invalid examples.  All of these centered around disallowing 
  the inclusion of additional properties not specified by the schema.
* Add a number of new json-schema validators for engine categories centered around text analytics and translation.
* See [160904a](https://github.com/veritone/veritone-sdk/commit/160904a60180e9e2bcf26c84efacea38c80ad58f) for full 
  details.

## Version 1.0.1
* Fixes the schema IDs to reflect their proper public hosting location.
* Depending on your use of the json-schemas, this could be considered a breaking change if you previously referenced
  the schema IDs.

## Version 1.0.2
* Changes to examples to integrate nicely with our docs site.

## Version 1.1.0
* Adds support for Anomaly Detection Engines

## Version 1.1.1
* Update lodash

## Version 1.2.0
* Add validation support for the AI Object Notation (AION) file type [application/vnd.veritone.aion+json](https://www.iana.org/assignments/media-types/application/vnd.veritone.aion+json)

## Version 1.3.0

> NOTE: This version was internal-only and not released to npm. These changes have been released
> as part of version 2.0

All schemas

* Added `internalTaskId` for documents
* Added `tags` to objects
* Added `fingerprintVector` to objects
* Added `referenceId` to objects
* Added `referenceId` to series

AION schema (aion/aion.json)

* Add embedded fingerprint vectors with `referenceId`
