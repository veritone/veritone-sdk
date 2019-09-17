import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '@material-ui/core/Button';
import Form from './Form';
import { generateState, validateForm } from './utils';

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
    label: 'Rating',
    name: 'rating-123',
    type: 'rating',
    instruction: 'Rating'
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

const requiredErrors = {
  'textInput-1234': 'Do not let this text empty',
  'email': 'Email is required',
  'checkBox-3456': 'You should select at least one'
}


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
        'rating-123': 4
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
  'email': (value) => {
    const re = /.+@.+\..+/;
    if (!value) {
      return requiredErrors['email'];
    }
    return re.test(String(value).toLowerCase()) ? '' : 'Not an email';
  },
  'textInput-1234': (value) => value ? '' : requiredErrors['textInput-1234'],
  'checkBox-3456': (value) => value ? '' : requiredErrors['checkBox-3456']
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
        'rating-123': 4
      }
    )
  );

  const [errors, setErrors] = React.useState({});

  const onSubmit = React.useCallback(() => {
    const errors = validateForm(formDefinition, formState, validateObject);
    setErrors(errors);
  }, [formState]);

  console.log(errors)

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