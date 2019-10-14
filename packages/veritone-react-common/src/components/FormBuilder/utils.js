import { errorChain } from './helpers';

export function ratingSchema(block) {
  return {
    name: block.name,
    schema: {
      minimum: block.min,
      maximum: block.max,
      type: 'integer'
    }
  }
}

export function stringSchema(block) {
  return {
    name: block.name,
    schema: {
      type: 'string'
    }
  }
}

export function enumSchema(block) {
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

export function arraySchema(block) {
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

export function booleanSchema(block) {
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
  select: enumSchema,
  number: ratingSchema,
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
  paragraph: '',
  number: 0,
}

export function generateSchema(formDefinition) {
  return {
    type: 'object',
    required: formDefinition.reduce((requiredFields, { name, required }) => {
      if (required) {
        return [...requiredFields, name]
      }
      return requiredFields;
    }, []),
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
    error: {}
  }), {});

  return Object.assign({}, emptyState, initialState);
}

export function validateForm(formDefinition=[], value={}, validate={}) {
  return formDefinition.reduce((formError, form ) => ({
    ...formError,
    [form.name]: errorChain({ data: value, settings: form})(validate[form.name])
  }), {});
}
