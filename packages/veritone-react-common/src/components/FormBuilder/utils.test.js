import * as formUtils from './utils';
import * as formHelpers from './helpers';

describe('Boolean schema', () => {
  it('Should return boolean schema', () => {
    expect(formUtils.booleanSchema({ name: 'booleanField' }))
      .toEqual({
        name: 'booleanField',
        schema: {
          type: 'boolean'
        }
      })
  })
})

describe('Array schema', () => {
  it('Should return array schema', () => {
    expect(formUtils.arraySchema({
      name: 'arrayField',
      items: [
        { id: '1', value: 'Option 1' },
        { id: '2', value: 'Option 2' }
      ]
    }))
      .toEqual({
        name: 'arrayField',
        schema: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['Option 1', 'Option 2']
          }
        }
      })
  })
});

describe('Enum schema', () => {
  it('Should return enum schema', () => {
    expect(formUtils.enumSchema({
      name: 'enumField',
      items: [
        { id: '1', value: 'Option 1' },
        { id: '2', value: 'Option 2' }
      ]
    }))
      .toEqual({
        name: 'enumField',
        schema: {
          type: 'string',
          enum: ['Option 1', 'Option 2']
        }
      })
  })
});

describe('String schema', () => {
  it('Should return string schema', () => {
    expect(formUtils.stringSchema({ name: 'stringField' }))
      .toEqual({
        name: 'stringField',
        schema: {
          type: 'string'
        }
      })
  })
})

describe('Rating schema', () => {
  it('Should return rating schema', () => {
    expect(formUtils.ratingSchema({ name: 'ratingField', min: 0, max: 5 }))
      .toEqual({
        name: 'ratingField',
        schema: {
          type: 'integer',
          minimum: 0,
          maximum: 5
        }
      })
  })
})

const formDefinition = [
  {
    name: 'textInput-1234',
    type: 'textInput',
    instruction: 'Input the text value',
    required: true
  },
  {
    name: 'paragraph-2345',
    type: 'paragraph',
    value: '<div>hello world</div>',
    instruction: 'Input biography',
    error: ''
  },
  {
    name: 'checkBox-3456',
    type: 'checkBox',
    items: [
      {
        value: 'option 1',
        id: '1'
      },
      {
        value: 'option 2',
        id: '2'
      },
      {
        value: 'option 3',
        id: '3'
      }
    ],
    required: true,
    instruction: 'Select your favourites',
  },
  {
    name: 'dateTime',
    type: 'dateTime',
    label: 'Birthday',
    instruction: 'Select your birthday'
  },
  {
    label: 'Rating',
    name: 'rating-123',
    type: 'rating',
    instruction: 'Rating',
    min: 3,
    max: 5
  },
];

describe('Generate schema', () => {
  it('Should return valid schema', () => {
    expect(formUtils.generateSchema(formDefinition))
      .toEqual({
        "properties": {
          "checkBox-3456": {
            "items": {
              "enum": ["option 1", "option 2", "option 3"],
              "type": "string"
            },
            "type": "array"
          },
          "dateTime": {
            "type": "string"
          },
          "paragraph-2345": {
            "type": "string"
          },
          "rating-123": {
            "maximum": 5,
            "minimum": 3,
            "type": "integer"
          },
          "textInput-1234": {
            "type": "string"
          }
        },
        "required": ["textInput-1234", "checkBox-3456"],
        "type": "object",
      })
  })
})

describe('Generate state', () => {
  it('Should generate state', () => {
    expect(formUtils.generateState(formDefinition))
      .toEqual({
        "checkBox-3456": [],
        "dateTime": formUtils.generateState(formDefinition).dateTime,
        "error": {},
        "paragraph-2345": "",
        "rating-123": 0,
        "textInput-1234": ""
      })
  })
})

describe('Validate form', () => {
  it('Shoud validate data with validate object', () => {
    expect(formUtils.validateForm(
      formDefinition,
      {
        "checkBox-3456": [],
        "dateTime": formUtils.generateState(formDefinition).dateTime,
        "error": {},
        "paragraph-2345": "",
        "rating-123": 0,
        "textInput-1234": ""
      },
      {
        "textInput-1234": formHelpers.validateEmpty
      }
    )["textInput-1234"])
      .toBe("TEXTINPUT-1234 is required")
  })
})
