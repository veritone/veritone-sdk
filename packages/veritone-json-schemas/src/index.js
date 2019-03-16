import * as Ajv from 'ajv';
import * as OBJECT_SCHEMA from '../schemas/vtn-standard/object/object.json';
import * as TRANSCRIPT_SCHEMA from '../schemas/vtn-standard/transcript/transcript.json';
import * as MASTER_SCHEMA from '../schemas/vtn-standard/master.json';

import { isEmpty, cloneDeep } from 'lodash';

const verifyObject = objectResult => {
  // validate object
  const ajv = new Ajv.default({
    allErrors: true,
    schemas: [MASTER_SCHEMA, OBJECT_SCHEMA]
  });
  const validate = ajv.compile(OBJECT_SCHEMA);
  const valid = validate(objectResult);

  // filtered results after validation
  const objectResultFiltered = cloneDeep(objectResult);
  const ajvFilter = new Ajv.default({
    allErrors: true,
    schemas: [MASTER_SCHEMA, OBJECT_SCHEMA],
    removeAdditional: true
  });
  ajvFilter.compile(OBJECT_SCHEMA);
  validate(objectResultFiltered);


  if (!valid) {
    return {
      errors: validate.errors
    };
  } else {
    return {
      valid: true,
      processed: objectResultFiltered
    };
  }
};

const verifyTranscript = transcriptResult => {
  // custom function for validating there is only one best path in a transcript lattice
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

  // validate transcript
  const ajv = new Ajv.default({
    allErrors: true,
    schemas: [MASTER_SCHEMA, TRANSCRIPT_SCHEMA]
  });
  ajv.addKeyword('requireBestPath', {
    validate: validateBestPath,
    errors: true
  });
  const validate = ajv.compile(TRANSCRIPT_SCHEMA);
  const valid = validate(transcriptResult);

  // validate transcript and filter out everything not validated
  const transcriptResultFiltered = cloneDeep(transcriptResult);
  const ajvFilter = new Ajv.default({
    allErrors: true,
    schemas: [MASTER_SCHEMA, TRANSCRIPT_SCHEMA],
    removeAdditional: true
  });
  ajvFilter.addKeyword('requireBestPath', {
    validate: validateBestPath,
    errors: true
  });
  ajvFilter.compile(TRANSCRIPT_SCHEMA);
  validate(transcriptResultFiltered);

  if (!valid) {
    return {
      errors: validate.errors
    };
  } else {
    return {
      valid: true,
      processed: transcriptResultFiltered
    };
  }
}

const VALIDATORS = {
  "transcript": verifyTranscript,
  "object": verifyObject
}

export { VALIDATORS, verifyObject, verifyTranscript };
