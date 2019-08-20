import Ajv from 'ajv';
import * as MEDIA_TRANSLATED_SCHEMA from '../schemas/vtn-standard/media-translated/media-translated.json';
import * as OBJECT_SCHEMA from '../schemas/vtn-standard/object/object.json';
import * as TRANSCRIPT_SCHEMA from '../schemas/vtn-standard/transcript/transcript.json';
import * as MASTER_SCHEMA from '../schemas/vtn-standard/master.json';

import { isEmpty, cloneDeep } from 'lodash';

const generateValidationContractValidator = (schema, customValidators = []) => {
  return result => {

    // validate results
    const ajv = new Ajv({
      allErrors: true,
      schemas: [MASTER_SCHEMA, schema]
    });
    for (const {keyword, validator} of customValidators) {
      ajv.addKeyword(keyword, {
        validate: validator,
        errors: true
      });
    }

    const validate = ajv.compile(schema);
    const valid = validate(result);

    // validate results and filter out everything not validated
    const resultFiltered = cloneDeep(result);
    const ajvFilter = new Ajv({
      schemas: [MASTER_SCHEMA, schema],
      removeAdditional: 'all'
    });
    for (const {keyword, validator} of customValidators) {
      ajvFilter.addKeyword(keyword, {
        validate: validator,
        errors: true
      });
    }

    const validateWithFilter = ajvFilter.compile(schema);
    validateWithFilter(resultFiltered);

    if (!valid) {
      return {
        errors: validate.errors
      };
    } else {
      return {
        valid: true,
        processed: resultFiltered
      };
    }
  };
};

// custom function for validating there is only one best path in a transcript lattice
const validateBestPath = function(schema, data) {
  validateBestPath.errors = [];
  if (data.filter(word => word.bestPath === true).length !== 1) {
    validateBestPath.errors.push({
      keyword: 'requireBestPath',
      message:
        'there should be one and only one bestPath in a transcription lattice',
      params: {
        words: data
      }
    });
    return false;
  }

  if (isEmpty(validateBestPath.errors)) {
    this.errors = undefined;
    return true;
  }
};

const verifyMediaTranslated = generateValidationContractValidator(MEDIA_TRANSLATED_SCHEMA);
const verifyObject = generateValidationContractValidator(OBJECT_SCHEMA);
const verifyTranscript = generateValidationContractValidator(TRANSCRIPT_SCHEMA, [{
  keyword: 'requireBestPath',
  validator: validateBestPath
}]);

const VALIDATORS = {
  'media-translated': verifyMediaTranslated,
  object: verifyObject,
  transcript: verifyTranscript,
};

export { VALIDATORS, verifyMediaTranslated, verifyObject, verifyTranscript };
