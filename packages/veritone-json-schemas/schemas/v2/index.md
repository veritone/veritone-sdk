# Veritone Standard JSON Schemas

This directory contains the standard JSON schemas used by Veritone.

> NOTE: AION v2 is still in a pre-release evaluation state.
>
> The current state of this release is:
>
> 1. AION v2.0 has object validation contracts for two new object types: `licensePlate` and
>    `motorVehicle`. The objects and validation rules are still under evaluation.
> 2. Object validation contracts have not been created for other object types yet. Each object
>    type will be evaluated and contracts will be created as needed. New contracts will be
>    defined in order to maintain as much backward compatibility with v1 documents as possible.
> 3. Capability validation contracts have been moved from individual "capability schemas" to
>    AION, and these contracts are subject to further review and change.
> 4. Documentation and example files have not undergone final review yet.

## AI Object Notation (AION) Schema

AION (pronounced "eye-on") is a universal schema defintion 
that describes all Veritone object notation instance structures. 

In addition to structural definitions, 
the AION schema also includes conditional contracts 
that enforce certain requirements on 
document capabilities as a whole (triggered by the listed `validationContracts`)
and object contents (triggered by an `object`s `type` field).

- [AI Object Notation (AION)](./aion/schema) ([Web version](./aion/schema.json))

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
