# Veritone Standard JSON Schemas

This directory contains the standard JSON schemas used by Veritone.

## AI Object Notation (AION) Schema

AION (pronounced "eye-on") is a universal schema defintion 
that describes all Veritone object notation instance structures. 

In addition to structural definitions, 
the AION schema also includes conditional contracts 
that enforce certain requirements on 
document capabilities as a whole (triggered by the listed `validationContracts`)
and object contents (triggered by an `object`s `type` field).

- [AI Object Notation (AION)](./aion/schema.json)

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

[CHANGELOG](./CHANGELOG.html)

``` {=html}
<style>
body { max-width: 72em !important; }
</style>
```