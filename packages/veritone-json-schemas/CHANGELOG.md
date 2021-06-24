# veritone-json-schemas changelog

## 0.1.0
* initial version published to NPM

## 0.1.1
* export a map of the validation contracts to the validation functions as VALIDATOR
* basic README.md
* cleanup for object validation contract

## 0.1.2
* fix VALIDATORS export

## 0.1.3
* revise TRANSCRIPT validator to make words optional
* add { processed: } to positive validations to show only the processed fields
* dynamic test loader
* empty words are no longer valid

## 0.1.4
* Fix { processed } for transcript.
* More tests, addd vtn-standard headers to transcript

## 0.1.5
* Change GUIDS from number to string
* Some minor changes in descriptions

## 0.1.6
* Changes to type enum in series / object results
* Support for object recognition/detection
* More examples for transcript

## 0.1.7
* Make object required if a series array is present
* Add test cases to prevent empty objects in summaries
* Add test case to make sure that an empty object summary with no recognition/detection is a valid result.

## 1.0.0
* **BREAKING CHANGE** Adds new restrictions to existing `object` and `transcription` validation contracts that caused 
  some previously valid examples to now be categorized as invalid examples.  All of these centered around disallowing 
  the inclusion of additional properties not specified by the schema.
* Add a number of new json-schema validators for engine categories centered around text analytics and translation.
* See [160904a](https://github.com/veritone/veritone-sdk/commit/160904a60180e9e2bcf26c84efacea38c80ad58f) for full 
  details.

## 1.0.1
* Fixes the schema IDs to reflect their proper public hosting location.
* Depending on your use of the json-schemas, this could be considered a breaking change if you previously referenced
  the schema IDs.

## 1.0.2
* Changes to examples to integrate nicely with our docs site.

## 1.1.0
* Adds support for Anomaly Detection Engines

## 1.1.1
* Update lodash

## 1.2.0
* Add validation support for the AI Object Notation (AION) file type [application/vnd.veritone.aion+json](https://www.iana.org/assignments/media-types/application/vnd.veritone.aion+json)
