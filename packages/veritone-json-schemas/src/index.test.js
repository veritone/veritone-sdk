import { VALIDATORS, verifyObject, verifyTranscript } from './index';
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
      console.warn(
        `No validator for validationContract: ${validationContract}`
      );
    }
  });
});

test('it should export a transcript validator', () => {
  expect(VALIDATORS['transcript']).toEqual(verifyTranscript);
  expect(verifyTranscript).not.toBeUndefined();
  expect(verifyTranscript).not.toBeNull();
});

test('it should invalidate an object with extra properties in the summary object array', () => {
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

  const results = verifyObject(objectSummaryWithTimeFields);
  expect(results.valid).not.toBe(true);
  expect(results.errors.length).toBe(2);
});

test('it should invalidate a transcript with extra properties', () => {
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

  const results = verifyTranscript(transcriptWithExtraField);
  expect(results.valid).not.toBe(true);
  expect(results.errors.length).toBe(2);
});

// TODO: Add media-translated (and other categories)-specific tests
