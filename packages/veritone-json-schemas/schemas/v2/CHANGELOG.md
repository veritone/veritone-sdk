# Version history for version 2 schemas

## Version 2.0 - June 20, 2025

- **Versioning introduced**
  - Prior versions are "version 1" and available at `https://get.aiware.com/schemas/v1/index.html`.
  - Uses [symantic versioning](https://semver.org/) conventions: major versions are not backward
    compatible, but minor versions are.
  - Individual versions are now immutable, and version number will be incremented for every
    change.
  - The official schema for each version is now at
    `https://get.aiware.com/schemas/<VERSION>/...` where version is `v1.0`, `v1.1`, `v2.0`,
    `v2.1`, etc. The latest minor version for every major version is linked under the major
    version number (`v2` is a link to `v2.1`, and will be moved to link to `v2.2` when
    that becomes the latest version).
- **Renamed the schema** from `aion/aion.json` to `aion/schema` to match the best practice
  implementation of the JSON schema meta schemas.
- **Capability Validation** is now performed in the AION schema. Capability validation is the
  validation contract for the AION document as a whole. Any AION document that contains a list
  of contracts in the `validationContracts` array is required to validate against the contracts
  that are listed
  - Deprecated separate "Capability Schema" documents. Now that all capability validation is
    handled by the AION schema, there is no longer a need for a separate schema for each
    capability. If you still need separate schemas for capability validation, please use 
    [version 1](http://get.aiware.com/schemas/v1/index.html) of the schemas.
- **Object Validation** has been added to AION. Object validation is the validation contract of
  each individual `object` in AION. Based on the `type` of `object` that object may
  need to validate against a contract for the object type.
- **New object type `licensePlate`** has been added with a validation contract.
- **New object type `motorVehicle`** has been added with a validation contract.