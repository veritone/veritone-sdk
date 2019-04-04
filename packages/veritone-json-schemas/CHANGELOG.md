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