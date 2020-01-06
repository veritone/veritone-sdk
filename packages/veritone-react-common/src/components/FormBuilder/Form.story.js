import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '@material-ui/core/Button';
import Form from './Form';
import { generateState, validateForm } from './utils';
import { validateEmail, validateEmpty, validateRange } from './helpers';

const formDefinition = [
  {
    name: 'textInput-1234',
    type: 'textInput',
    instruction: 'Input the text value',
    required: true
  },
  {
    name: 'email',
    type: 'textInput',
    instruction: 'Input the email',
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
    label: 'Number',
    name: 'number-123',
    type: 'number',
    instruction: 'Input your age',
    min: 18,
    max: 23
  },
  {
    name: 'radio',
    type: 'radio',
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
    instruction: 'Select your education',
  },
  {
    name: 'select',
    type: 'select',
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
    instruction: 'Select you gender'
  }
];


function BasicForm() {
  const [formState, setFormState] = React.useState(generateState(formDefinition));

  return (
    <Form value={formState} onChange={setFormState} formDefinition={formDefinition} />
  );
}

function FormWithInitialState() {
  const [
    formState,
    setFormState
  ] = React.useState(
    generateState(
      formDefinition,
      {
        'textInput-1234': 'Hello world, this text is initialized',
        'select': 'option 1',
        'number-123': 4,
        'checkBox-3456': ['option 1']
      }
    )
  );
  return (
    <Form
      value={formState}
      onChange={setFormState}
      formDefinition={formDefinition}
    />
  );
}

const validateObject = {
  'email': [validateEmpty, validateEmail],
  'textInput-1234': validateEmpty,
  'checkBox-3456': ({ data, settings: { name } }) => {
    if (data[name].length === 0) {
      return 'Please select at least one option';
    }
  },
  'number-123': validateRange
}

function FormWithValidate() {
  const [
    formState,
    setFormState
  ] = React.useState(
    generateState(
      formDefinition,
      {
        'textInput-1234': 'Hello world, this text is initialized',
        'select': 'option 1',
        'number-123': 4
      }
    )
  );

  const [errors, setErrors] = React.useState({});

  const onSubmit = React.useCallback(() => {
    const errors = validateForm(formDefinition, formState, validateObject);
    setErrors(errors);
  }, [formState]);

  return (
    <div>
      <Form
        value={formState}
        onChange={setFormState}
        formDefinition={formDefinition}
        errors={errors}
      />
      <hr />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}

storiesOf('FormBuilder/Form', module)
  .add('Basic', () => <BasicForm />)
  .add('With initial state', () => <FormWithInitialState />)
  .add('With validate', () => <FormWithValidate />)
