import _ from 'lodash';

function ratingSchema(block) {
  return {
    name: block.name,
    schema: {
      minimum: block.min,
      maximum: block.max,
      type: 'integer'
    }
  }
}

function stringSchema(block) {
  return {
    name: block.name,
    schema: {
      type: 'string'
    }
  }
}

function enumSchema(block) {
  return {
    name: block.name,
    schema: {
      type: 'string',
      enum: block.items.reduce((currentEnums, { value }) => [
        ...currentEnums,
        value
      ], [])
    }
  }
}

function arraySchema(block) {
  return {
    name: block.name,
    schema: {
      type: 'array',
      items: {
        type: 'string',
        enum: block.items.reduce((currentEnums, { value }) => [
          ...currentEnums,
          value
        ], [])
      }
    }
  }
}

function booleanSchema(block) {
  return {
    name: block.name,
    schema: {
      type: 'boolean'
    }
  }
}


const mapSchema = {
  rating: ratingSchema,
  textInput: stringSchema,
  radio: enumSchema,
  dateTime: stringSchema,
  geoPoint: stringSchema,
  ip: stringSchema,
  paragraph: stringSchema,
  checkBox: arraySchema,
  switch: booleanSchema,
  select: enumSchema
}

export const formDefaultValue = {
  rating: 0,
  textInput: '',
  radio: '',
  dateTime: new Date(),
  switch: false,
  checkBox: [],
  ip: '',
  geoPoint: '',
  select: '',
  paragraph: ''
}

export function generateSchema(formDefinition) {
  return {
    type: 'object',
    properties: formDefinition.reduce((currentForm, block) => {
      const { name, schema } = mapSchema[block.type](block);
      return {
        ...currentForm,
        [name]: schema
      }
    }, {})
  }
}

export function generateState(formDefinition=[], initialState={}) {
  const emptyState = formDefinition.reduce((currentForm, { name, type }) => ({
    ...currentForm,
    [name]: formDefaultValue[type],
    error: ''
  }), {});

  return Object.assign({}, emptyState, initialState);
}

export function validateForm(formDefinition=[], value={}, validate={}) {
  return formDefinition.reduce((formError, { name } ) => {
    if (_.isFunction(validate[name])) {
      return {
        ...formError,
        [name]: validate[name](value[name])
      }
    }
    return formError;
  }, {});
}
