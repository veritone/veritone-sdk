import * as Ajv from 'ajv';
import * as OBJECT_SCHEMA from '../schemas/vtn-standard/object/object.json';
import * as TRANSCRIPT_SCHEMA from '../schemas/vtn-standard/transcript/transcript.json';
import * as MASTER_SCHEMA from '../schemas/vtn-standard/master.json';

import { isEmpty } from 'lodash';

const VALIDATORS = {
  "transcript": verifyTranscript,
  "object": verifyObject
}

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

const verifyTranscript = transcriptResult => {
  const ajv = new Ajv.default({
    allErrors: true,
    schemas: [MASTER_SCHEMA, TRANSCRIPT_SCHEMA]
  });

  const validateBestPath = function (schema, data) {
    validateBestPath.errors = [];
    if(data.filter( word => word.bestPath === true).length !== 1) {
      validateBestPath.errors.push(
        {
          keyword: 'requireBestPath',
          message: 'there should be one and only one bestPath in a transcription lattice',
          params: {
            words: data
          }
        }
      );
      return false
    }

    if(isEmpty(validateBestPath.errors)) {
      this.errors = undefined;
      return true
    }
  };

  ajv.addKeyword('requireBestPath', {
    validate: validateBestPath,
    errors: true
  });

  const validate = ajv.compile(TRANSCRIPT_SCHEMA);
  const valid = validate(transcriptResult);

  if (!valid) {
    return validate.errors;
  } else {
    return true;
  }
}

export { VALIDATORS, verifyObject, verifyTranscript };
