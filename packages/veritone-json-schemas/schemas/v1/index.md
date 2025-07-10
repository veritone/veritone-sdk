# Veritone Standard JSON Schemas

This directory contains the standard JSON schemas used by Veritone.

## AI Object Notation (AION) Schema

AION (pronounced "eye-on") is a universal schema defintion that describes all Veritone object
notation instance structures. AION contains no validation requirements.

- [AI Object Notation (AION)](./aion/aion.json)

## Capability Schemas

Capability schemas are subsets of the AION schema that includes validation requirements. Each of
these schemas must contain a `validationContracts` array that lists the engine capability that
the AION instance document fulfills.

Some capabilities are compatible with each other (like `transcript`, `language`), but others are
not (like `text` and `anomaly`)

- [Anomaly](./anomaly/anomaly.json)
- [Concept](./concept/concept.json)
- [Entity](./entity/entity.json)
- [Keyword](./keyword/keyword.json)
- [Language](./language/language.json)
- [Object](./object/object.json)
- [Sentiment](./sentiment/sentiment.json)
- [Summary](./summary/summary.json)
- [Text](./text/text.json)
- [Transcript](./transcript/transcript.json)
- [Translated Media](./media-translated/media-translated.json)

## Definitions

Definitions referenced by other schemas

- [Master Definitions](./master.json)

## Version History

[CHANGELOG](./CHANGELOG.html)
