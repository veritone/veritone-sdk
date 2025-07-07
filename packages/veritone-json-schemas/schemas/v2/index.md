# Veritone Standard JSON Schemas

This directory contains the standard JSON schemas used by Veritone.

## AI Object Notation (AION)

AION (pronounced "eye-on") is a universal schema defintion 
that describes all Veritone object notation instance structures. 

### Contracts

In addition to structural definitions, 
the AION schema also includes conditional contracts 
that enforce certain requirements on 
document capabilities as a whole (triggered by the listed `validationContracts`)
and object contents (triggered by an `object`s `type` field).

The purpose of these contracts is to ensure that all engines that are generating data for the
same type of cognition processing (like logo-detection, face-detection, transcription, etc)
adhere to some basic rules for how to store data for that type of data. This ensures that the
data from these engines remains interoperable within the aiWARE ecosystem. For example, we don't
want some OCR engines to store their data in `labels` and other OCR engines to store their data
in `text` fields, and still others storing data in the `objectCategory` structures as this would
make it difficult to reliably search for OCR-recognized text.

### Capability Contracts

Capability contracts describe validation contracts for the whole document. A capability contract
is invoked by including a `validatenContracts` array in the document with one of the capability
names like `concept`, `sentiment`, `summary`, `language`, etc. When you invoke a capability
contract, this may impose both requirements and restrictions on what data you may include in the
document.

For example, the `sentiment` contract requires you to include either a `sentiment` or `emotions`
record for the whole document or every object in the document. The `transcript` contract
requires a time-`series` array containing when `words` have been spoken.

Capabiliy contractst are optional... if you do not include a `validationContracts` field, then
no capability contracts apply.

### Object Contracts

Where capability contracts impose requirements on the whole document, object contracts impose
requirements only on specific objects. If an object has a type like `licensePlate` then
that contract requires the object to contain a `licensePlate` record that contains a license
plate `number`. Likewise, if an object has a type `face` then that object must describe a
polygon that identifies the location of the face.

However, a document can contain `licensePlate` objects, `face` objects, and any other kinds of
objects all mixed together, and the object contract only imposes requirements on each object in
isolation regardless of other objects around it (as opposed to capability contracts which often
limit the document to only containing one type of object.)

Object contracts are not optional... every object must have a `type` and that automatically
imposes the contract for that type of object on the object contents.

## Validation

Validation of a JSON instance file against the AION schema can be done with any JSON schema
validation tool.

### Example: Online validator

To use an online tool to validate a file against the AION 2.0 schema, you can do the following:
1. Go to (for example) https://jsonschemavalidator.net/
2. In the left hand panel, enter a schema that imports the AION v2.0 schema:
```json
{
  "$ref": "https://get.aiware.com/schemas/v2.0/aion/schema.json"
}
```

3. In the right hand panel, enter a JSON instance that is invalid:
```json
{
  "validationContracts": [ "language" ]
}
```
and you will see an error: `Required properties are missing from object: language`

4. Add a language property:
```json
{
  "validationContracts": [ "language" ],
  "language": "ru"
}
```
and the status will change: `JSON validates against the schema`

### Example: Localhost validator

Assuming `docker` is available, the following will allow you to validate an instance file
`file.json` against version 2.0 of the AION schema:

```bash
curl https://get.aiware.com/schemas/v2.0/aion/schema.json --output aion.json
curl https://get.aiware.com/schemas/v2.0/master.json --output master.json
curl https://get.aiware.com/schemas/v2.0/contracts.json --output contracts.json
docker run --interactive --rm --volume "$PWD:/workspace" \
  ghcr.io/sourcemeta/jsonschema validate --verbose aion.json file.json \
  -r master.json -r contracts.json
```

## AION Schema

- [AI Object Notation (AION)](./aion/schema.json)

## Examples

[Examples](./examples.html)

## Definitions

Definitions referenced by other schemas. 
These files do not contain any schema requirements themselves, 
only `definitions` that are referenced by other schema files.

- [Master Definitions](./master.json)  
  Contains the definitions for individual components referenced by the AION schema.
- [Contract Definitions](./contracts.json)  
  Contains the conditional contracts that are used by the AION schema to validate that
  requirements for capabilities and object are met.

## Version History

[Version History](./CHANGELOG.html)

``` {=html}
<style>
body { max-width: 72em !important; }
</style>
```