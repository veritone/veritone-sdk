import * as Ajv from 'ajv';
import * as OBJECT_SCHEMA from '../schemas/object/vtn-standard.object.schema.json';
import * as MASTER_SCHEMA from '../schemas/vtn-standard.schema.json';

const verifyObject = objectResult => {
  const ajv = new Ajv.default({
    allErrors: true,
    schemas: [MASTER_SCHEMA, OBJECT_SCHEMA]
  });
  const validate = ajv.compile(OBJECT_SCHEMA);
  const valid = validate(objectResult);

  if (!valid) {
    return validate.errors;
  } else {
    return true;
  }
};

export { verifyObject };

console.log(
  'Verified',
  verifyObject(
    {
      "schemaId": "https://docs.veritone.com/schemas/vtn-standard/master.json",
      "validationContracts": [
        "object"
      ],
      "object": [
        {
          "type": "object",
          "label": "dog",
          "confidence": 0.9,
          "boundingPoly": [
            {
              "x": 0.1,
              "y": 0.1
            },
            {
              "x": 0.1,
              "y": 0.5
            },
            {
              "x": 0.5,
              "y": 0.5
            },
            {
              "x": 0.5,
              "y": 0.1
            }
          ],
          "objectCategory": [{
            "class": "animal",
            "@id": "1576"
          }]
        },
        {
          "type": "object",
          "label": "cat",
          "confidence": 0.55,
          "objectCategory": [{
            "class": "animal",
            "@id": "1576"
          }]
        }
      ],
      "series": [
        {
          "startTimeMs": 2000,
          "stopTimeMs": 2100,
          "object": {
            "type": "object",
            "label": "dog",
            "objectCategory": [{
              "class": "animal",
              "@id": "1576"
            }],
            "confidence": 0.9,
            "boundingPoly": [
              {
                "x": 0.1,
                "y": 0.1
              },
              {
                "x": 0.1,
                "y": 0.5
              },
              {
                "x": 0.5,
                "y": 0.5
              },
              {
                "x": 0.5,
                "y": 0.1
              }
            ]
          }
        },
        {
          "startTimeMs": 2100,
          "stopTimeMs": 2200,
          "object": {
            "type": "object",
            "label": "cat",
            "confidence": 0.55,
            "objectCategory": [{
              "class": "animal",
              "@id": "1576"
            }]
          }
        },
        {
          "startTimeMs": 1400,
          "stopTimeMs": 2200,
          "object": {
            "type": "object",
            "label": "ball",
            "confidence": 0.55,
            "objectCategory": [{
              "class": "toys",
              "@id": "3526"
            }]
          }
        }
      ]
    }
  )
);
