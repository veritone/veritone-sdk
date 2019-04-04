import { verifyObject, verifyTranscript, VALIDATORS } from './index';
import _ from 'lodash';

import glob from 'glob';

const validationContracts = {};

// dynamically import all json files in examples or invalid-examples
const files = glob.sync(
  'schemas/vtn-standard/**/**(examples|invalid-examples)/!(master.json)//*.json'
);
for (let file of files) {
  const validationContractIndex =
    file.split('/').findIndex(directory => _.includes(directory, 'examples')) -
    1;
  const validationContract = file.split('/')[validationContractIndex];
  let directory = file.split('/');
  let fileName = directory.pop();
  directory = directory.join('/');
  const test = { directory, fileName };

  if (validationContract in validationContracts) {
    validationContracts[validationContract].push(test);
  } else {
    validationContracts[validationContract] = [test];
  }
}

Object.keys(validationContracts).forEach(validationContract => {
  describe(`"${validationContract}" tests`, () => {
    const validator = VALIDATORS[validationContract];
    if (typeof validator === 'function') {
      for (let test of validationContracts[validationContract]) {
        if (_.includes(test.directory, 'invalid')) {
          // JSON files in invalid-examples should not validate
          it(`should NOT validate ${test.directory}/${
            test.fileName
          }`, async () => {
            const json = await import(`../${test.directory}/${test.fileName}`);
            const invalidResult = validator(json);
            expect(invalidResult).not.toHaveProperty('valid');
            expect(invalidResult.errors).not.toBeNull();
            expect(invalidResult.errors).not.toBeUndefined();
            expect(invalidResult.errors.length).toBeGreaterThan(0);
          });
        } else {
          // JSON files in examples should validate
          it(`should validate ${test.directory}/${test.fileName}`, async () => {
            const json = await import(`../${test.directory}/${test.fileName}`);
            const validResult = validator(json);
            expect(validResult).toHaveProperty('valid');
            expect(validResult.processed).not.toBeNull();
            expect(validResult.processed).not.toBeUndefined();
          });
        }
      }
    } else {
      console.warn(`No validator for validationConract: ${validationContract}`);
    }
  });
});

test('it should export a transcript validator', () => {
  expect(VALIDATORS['transcript']).toEqual(verifyTranscript);
  expect(verifyTranscript).not.toBeUndefined();
  expect(verifyTranscript).not.toBeNull();
});

test('it should validate an object but strip out startTimeMs and stopTimeMs in the summary object array', () => {
  const objectSummaryWithTimeFields = {
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/object.json',
    validationContracts: ['object'],
    object: [
      {
        type: 'object',
        label: 'dog',
        confidence: 0.9,
        boundingPoly: [
          {
            x: 0.1,
            y: 0.1
          },
          {
            x: 0.1,
            y: 0.5
          },
          {
            x: 0.5,
            y: 0.5
          },
          {
            x: 0.5,
            y: 0.1
          }
        ],
        startTimeMs: 0,
        stopTimeMs: 2200
      }
    ]
  };

  const objectSummaryWithoutTimeFields = {
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/object.json',
    validationContracts: ['object'],
    object: [
      {
        type: 'object',
        label: 'dog',
        confidence: 0.9,
        boundingPoly: [
          {
            x: 0.1,
            y: 0.1
          },
          {
            x: 0.1,
            y: 0.5
          },
          {
            x: 0.5,
            y: 0.5
          },
          {
            x: 0.5,
            y: 0.1
          }
        ]
      }
    ]
  };

  const results = verifyObject(objectSummaryWithTimeFields);
  expect(results.valid).toBe(true);
  expect(results.processed).toEqual(objectSummaryWithoutTimeFields);
  expect(results.errors).toBe(undefined);
});

test('it should validate an object and filter out extra fields', () => {
  const objectWithExtraFields = {
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/object.json',
    validationContracts: ['object'],
    object: [
      {
        type: 'object',
        label: 'dog',
        confidence: 0.9,
        boundingPoly: [
          {
            x: 0.1,
            y: 0.1
          },
          {
            x: 0.1,
            y: 0.5,
            extra: 'should be stripped out'
          }
        ],
        objectCategory: [
          {
            class: 'animal',
            '@id': '1576',
            extra: 'should be stripped out'
          }
        ]
      },
      {
        type: 'object',
        label: 'cat',
        extra: 'should be stripped out',
        confidence: 0.55,
        objectCategory: [
          {
            class: 'animal',
            '@id': '1576'
          }
        ]
      }
    ],
    series: [
      {
        startTimeMs: 2000,
        stopTimeMs: 2100,
        object: {
          type: 'object',
          label: 'dog',
          objectCategory: [
            {
              class: 'animal',
              '@id': '1576'
            }
          ],
          confidence: 0.9,
          boundingPoly: [
            {
              x: 0.1,
              y: 0.1
            },
            {
              x: 0.1,
              y: 0.5
            }
          ]
        }
      },
      {
        startTimeMs: 2100,
        stopTimeMs: 2200,
        object: {
          type: 'object',
          label: 'cat',
          confidence: 0.55,
          objectCategory: [
            {
              class: 'animal',
              '@id': '1576'
            }
          ]
        }
      },
      {
        startTimeMs: 1400,
        stopTimeMs: 2200,
        object: {
          type: 'object',
          label: 'ball',
          confidence: 0.55,
          objectCategory: [
            {
              class: 'toys',
              '@id': '3526',
              extra: 'should be stripped out'
            }
          ]
        }
      }
    ]
  };

  const objectWithoutExtraFields = {
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/object.json',
    validationContracts: ['object'],
    object: [
      {
        type: 'object',
        label: 'dog',
        confidence: 0.9,
        boundingPoly: [
          {
            x: 0.1,
            y: 0.1
          },
          {
            x: 0.1,
            y: 0.5
          }
        ],
        objectCategory: [
          {
            class: 'animal',
            '@id': '1576'
          }
        ]
      },
      {
        type: 'object',
        label: 'cat',
        confidence: 0.55,
        objectCategory: [
          {
            class: 'animal',
            '@id': '1576'
          }
        ]
      }
    ],
    series: [
      {
        startTimeMs: 2000,
        stopTimeMs: 2100,
        object: {
          type: 'object',
          label: 'dog',
          objectCategory: [
            {
              class: 'animal',
              '@id': '1576'
            }
          ],
          confidence: 0.9,
          boundingPoly: [
            {
              x: 0.1,
              y: 0.1
            },
            {
              x: 0.1,
              y: 0.5
            }
          ]
        }
      },
      {
        startTimeMs: 2100,
        stopTimeMs: 2200,
        object: {
          type: 'object',
          label: 'cat',
          confidence: 0.55,
          objectCategory: [
            {
              class: 'animal',
              '@id': '1576'
            }
          ]
        }
      },
      {
        startTimeMs: 1400,
        stopTimeMs: 2200,
        object: {
          type: 'object',
          label: 'ball',
          confidence: 0.55,
          objectCategory: [
            {
              class: 'toys',
              '@id': '3526'
            }
          ]
        }
      }
    ]
  };

  const results = verifyObject(objectWithExtraFields);
  expect(results.valid).toBe(true);
  expect(results.processed).toEqual(objectWithoutExtraFields);
  expect(results.errors).toBe(undefined);
});

test('it should validate a transcript and filter out extra fields', () => {
  const transcriptWithExtraField = {
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/transcript.json',
    validationContracts: ['transcript'],
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 300,
        words: [
          {
            word: 'is'
          }
        ],
        extra: 'should be stripped out'
      },
      {
        startTimeMs: 300,
        stopTimeMs: 500,
        words: [
          {
            word: 'is'
          }
        ]
      },
      {
        startTimeMs: 500,
        stopTimeMs: 800,
        words: [
          {
            word: 'a',
            extra: 'should be stripped out'
          }
        ]
      },
      {
        startTimeMs: 800,
        stopTimeMs: 1200,
        words: [
          {
            word: 'sentence'
          }
        ]
      }
    ]
  };

  const transcriptWithoutExtraField = {
    schemaId: 'https://docs.veritone.com/schemas/vtn-standard/transcript.json',
    validationContracts: ['transcript'],
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 300,
        words: [
          {
            word: 'is'
          }
        ]
      },
      {
        startTimeMs: 300,
        stopTimeMs: 500,
        words: [
          {
            word: 'is'
          }
        ]
      },
      {
        startTimeMs: 500,
        stopTimeMs: 800,
        words: [
          {
            word: 'a'
          }
        ]
      },
      {
        startTimeMs: 800,
        stopTimeMs: 1200,
        words: [
          {
            word: 'sentence'
          }
        ]
      }
    ]
  };

  const results = verifyTranscript(transcriptWithExtraField);
  expect(results.valid).toBe(true);
  expect(results.processed).toEqual(transcriptWithoutExtraField);
  expect(results.errors).toBe(undefined);
});
