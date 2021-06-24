import Ajv from 'ajv';
import { isEmpty, cloneDeep } from 'lodash';

import * as MASTER_SCHEMA from '../schemas/vtn-standard/master.json';
import * as AION_SCHEMA from '../schemas/vtn-standard/aion/aion.json';
import * as CONCEPT_SCHEMA from '../schemas/vtn-standard/concept/concept.json';
import * as ENTITY_SCHEMA from '../schemas/vtn-standard/entity/entity.json';
import * as KEYWORD_SCHEMA from '../schemas/vtn-standard/keyword/keyword.json';
import * as LANGUAGE_SCHEMA from '../schemas/vtn-standard/language/language.json';
import * as MEDIA_TRANSLATED_SCHEMA from '../schemas/vtn-standard/media-translated/media-translated.json';
import * as OBJECT_SCHEMA from '../schemas/vtn-standard/object/object.json';
import * as SENTIMENT_SCHEMA from '../schemas/vtn-standard/sentiment/sentiment.json';
import * as SUMMARY_SCHEMA from '../schemas/vtn-standard/summary/summary.json';
import * as TEXT_SCHEMA from '../schemas/vtn-standard/text/text.json';
import * as TRANSCRIPT_SCHEMA from '../schemas/vtn-standard/transcript/transcript.json';
import * as ANOMALY_SCHEMA from '../schemas/vtn-standard/anomaly/anomaly.json';

/**
 * Generates a function that will validate vtn-standard for a validation contract
 * @param {Object} schema json-schema for the vtn-standard validationContract
 * @param {{keyword: String, validator: SchemaValidateFunction}[]} [customValidators]
 *   Array of additional validation functions and their keyword names.
 *   Will be added to the ajv parser with .addKeyword().
 * @return {Function} The validation function
 */
const generateValidationContractValidator = (schema, customValidators = []) => {
  return result => {
    // validate results
    const ajv = new Ajv({
      allErrors: true,
      schemas: [MASTER_SCHEMA, schema]
    });
    for (const { keyword, validator } of customValidators) {
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
      removeAdditional: true
    });
    for (const { keyword, validator } of customValidators) {
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

/**
 * Custom function for validating there is only one best path in a transcript lattice
 * @type SchemaValidateFunction
 */
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

const verifyAion = generateValidationContractValidator(AION_SCHEMA);

const verifyConcept = generateValidationContractValidator(CONCEPT_SCHEMA);
const verifyEntity = generateValidationContractValidator(ENTITY_SCHEMA);
const verifyKeyword = generateValidationContractValidator(KEYWORD_SCHEMA);
const verifyLanguage = generateValidationContractValidator(LANGUAGE_SCHEMA);
const verifyMediaTranslated = generateValidationContractValidator(
  MEDIA_TRANSLATED_SCHEMA
);
const verifyObject = generateValidationContractValidator(OBJECT_SCHEMA);
const verifySentiment = generateValidationContractValidator(SENTIMENT_SCHEMA);
const verifySummary = generateValidationContractValidator(SUMMARY_SCHEMA);
const verifyText = generateValidationContractValidator(TEXT_SCHEMA);
const verifyAnomaly = generateValidationContractValidator(ANOMALY_SCHEMA);
const verifyTranscript = generateValidationContractValidator(
  TRANSCRIPT_SCHEMA,
  [
    {
      keyword: 'requireBestPath',
      validator: validateBestPath
    }
  ]
);

const VALIDATORS = {
  aion: verifyAion,
  concept: verifyConcept,
  entity: verifyEntity,
  keyword: verifyKeyword,
  language: verifyLanguage,
  'media-translated': verifyMediaTranslated,
  object: verifyObject,
  sentiment: verifySentiment,
  summary: verifySummary,
  text: verifyText,
  transcript: verifyTranscript,
  anomaly: verifyAnomaly
};

export {
  VALIDATORS,
  verifyAion,
  verifyConcept,
  verifyEntity,
  verifyKeyword,
  verifyLanguage,
  verifyMediaTranslated,
  verifyObject,
  verifySentiment,
  verifyText,
  verifyTranscript,
  verifyAnomaly
};
