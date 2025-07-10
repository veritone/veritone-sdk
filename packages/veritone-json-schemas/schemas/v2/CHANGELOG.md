# Version history for version 2 schemas

## Version 2.0 - July 3, 2025

- **Versioning introduced.** The reason for introducing versioning is to be more deliberate and
  concise about what is supported. As new cognitive and generative capabilities are added to the
  aiWARE ecosystem, it is becoming more critical to update the AION specification in a
  controlled manner to adjust best practices while still maintaining backward compatibility.
  - Prior versions are "version 1" and available at [https://get.aiware.com/schemas/v1/index.html](https://get.aiware.com/schemas/v1/index.html)
  - Uses [symantic versioning](https://semver.org/) conventions: major versions are not backward
    compatible, but minor versions are.
  - Individual versions are now immutable, and version number will be incremented for every
    change.
  - The official schema for each version is now at
    `https://get.aiware.com/schemas/vM.N/...` where the version is like `v1.0`, `v1.1`, `v2.0`,
    `v2.1`, etc. Example: [https://get.aiware.com/schemas/v2.0/index.html](https://get.aiware.com/schemas/v2.0/index.html)
    - The latest minor version for every major version is also linked under the major
      version number `vM`. For example, at the time of writing, `v2` is a link to `v2.0`, and will
      be moved to link to `v2.1` when that version is released. Example:
      [https://get.aiware.com/schemas/v2/index.html](https://get.aiware.com/schemas/v2/index.html)
    - The overall latest version will always be version number "latest". Example:
      [https://get.aiware.com/schemas/latest/index.html](https://get.aiware.com/schemas/latest/index.html)
    - A full index of all released versions is available at
      [https://get.aiware.com/schemas/index.html](https://get.aiware.com/schemas/index.html)
- **Renamed the schema** from "`aion/aion.json`" to "`aion/schema.json`" to match best practice
  for schema names.
- **Changed the Content-Type** of all schemas from `application/json` to
  `application/schema+json` per best practices.
- **Capability validation** is now performed in the AION schema. Capability validation is the
  validation contract for the AION document as a whole. Any AION document that contains a list
  of contracts in the `validationContracts` array is required to validate against the contracts
  that are listed
  - The separate "Capability Schema" documents have been deprecated. Now that AION contains all
    capability validation, there is no longer a need for a separate schema for each
    capability. If you still need separate schemas for capability validation, please use 
    [version 1](http://get.aiware.com/schemas/v1/index.html) of the schemas.
- **Object validation** has been added to AION. Object validation is the validation contract of
  each individual `object` in AION. Based on the `type` of `object`, that object may
  need to validate against a contract for the object type. For example, if you specify an object
  is of `"type": "entity"`, you *MUST* include a `label` and `objectCategory` for that object, you
  *MAY* provide other fields like `page` or `text`, and you *MUST NOT* provide irrelevant fields like
  `lipMovement`, `age`, or `mode`.
  - All legacy object types have object validation requirements. These requirements were
    designed to accommodate as much of the legacy usage as possible. If your engine does not
    meet these requirement, we recommend you update your engine. If this is not possible, then
    continue to use the v1 schemas.
- **Comment support** has been added for documents, objects, and series. Taking a page from the
  json-schema definitions, we now allow a `$comment` property in any document, object or series 
  item. The value must be a string, and is ignored by aiWARE processing. In addition, any
  property at the root of the document starting with a `$` character is permitted but
  ignored by the aiWARE ecosystem.
- **New object types** have been added:
  - **`licensePlate`** requries a `licensePlate` with a `number`.
  - **`motorVehicle`** requries a `motorVehicle` that may optionally have a `licensePlate`.
  - **`ocr`** requires a `text` and `boundingPoly`. The type `"ocr"` is a
    specialization of the `"text"` type, so an `ocr` object counts as a `text` object for the
    purposes of validating `"validationContracts": ["text"]`.
- **Partial word transcription** support has been added. Transcribed `words` now have an optional
  `partial` property that can be set to `true` when doing real-time trasncription to indicate 
  that the word or phrase has only been partially transcribed, and may be changed as more context 
  becomes available.

``` {=html}
<style>
body { max-width: 72em !important; }
</style>
```