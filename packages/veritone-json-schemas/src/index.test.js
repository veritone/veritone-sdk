import { verifyObject, verifyTranscript, VALIDATORS } from './index';
import _ from 'lodash';

import glob from 'glob';

const categories = {};

// dynamically import all json files in examples or invalid-examples
const files = glob.sync("schemas/vtn-standard/**/**(examples|invalid-examples)/!(master.json)//*.json");
for(let file of files) {
  const categoryIndex = file.split("/").findIndex(directory => _.includes(directory, "examples")) - 1;
  const category = file.split("/")[categoryIndex];
  let directory = file.split("/");
  let fileName = directory.pop();
  directory = directory.join("/");
  const test = {directory, fileName};

  if (category in categories) {
    categories[category].push(test);
  } else {
    categories[category] = [test];
  }
}

Object.keys(categories).forEach(category => {
  describe(`"${category}" tests`, () => {
    const validator = VALIDATORS[category];
    if(typeof validator === 'function') {
      for(let test of categories[category]) {
        if( _.includes(test.directory, 'invalid' )) {

          // JSON files in invalid-examples should not validate
          it(`should NOT validate ${test.directory}/${test.fileName}`, async () => {
            const json = await import (`../${test.directory}/${test.fileName}`);
            const invalidResult = validator(json);

            expect(invalidResult.errors).not.toBeNull();
            expect(invalidResult.errors).not.toBeUndefined();
            expect(invalidResult.errors.length).toBeGreaterThan(0);
          });

        } else {

          // JSON files in examples should validate
          it(`should validate ${test.directory}/${test.fileName}`, async () => {
            const json = await import (`../${test.directory}/${test.fileName}`);
            const validResult = validator(json);
            if(!validResult.valid) {
              expect(json).toBeNull();
            }
            expect(validResult).toHaveProperty("valid");
            expect(validResult.processed).not.toBeNull();
            expect(validResult.processed).not.toBeUndefined();
          });

        }
      };
    } else {
      console.warn(`No validator for engineCategory: ${category}`)
    }
  })
});

test('it should export a transcript validator', () => {
  expect(VALIDATORS['transcript']).toEqual(verifyTranscript);
  expect(verifyTranscript).not.toBeUndefined();
  expect(verifyTranscript).not.toBeNull();
});
