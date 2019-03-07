import * as Ajv from 'ajv';
import * as OBJECT_SCHEMA from '../schemas/vtn-standard/object/object.json';
import * as MASTER_SCHEMA from '../schemas/vtn-standard/master.json';

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
