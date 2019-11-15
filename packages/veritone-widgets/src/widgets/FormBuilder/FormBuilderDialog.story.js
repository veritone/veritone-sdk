import React from 'react';
import { shape, string, arrayOf } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import FormBuider from './FormBuilderDialog';

const emptyForm = {
  name: 'New form',
  definition: [],
  locations: [],
  dataRegistryId: ''
};

const registeredForm = {
  name: 'Registered form',
  definition: [
    {
      name: "textInput-1234",
      type: "textInput"
    },
    {
      name: "paragraph-2345",
      type: "paragraph"
    },
    {
      name: "checkBox-3456",
      type: "checkBox",
      items: [
        {
          value: "option 1",
          id: "1"
        },
        {
          value: "option 2",
          id: "2"
        },
        {
          value: "option 3",
          id: "3"
        }
      ]
    }
  ],
  locations: [
    {
      id: '1',
      name: 'Mention details'
    },
    {
      id: '2',
      name: 'CMS folders'
    },
    {
      id: '3',
      name: 'CMS sources'
    }
  ],
  dataRegistryId: 'fake-data-registry-id'
}

function BaseStory({ initialForm, ...props }) {
  const [form, setForm] = React.useState(initialForm);
  return <FormBuider form={form} onChange={setForm} {...props} />
}

BaseStory.propTypes = {
  initialForm: shape({
    name: string,
    definition: arrayOf(shape({
      name: string,
      type: string
    })),
    locations: arrayOf(shape({
      id: string,
      name: string
    })),
    dataRegistryId: string
  })
}

storiesOf('FormBuilder/FormBuilderPage', module)
  .add('Create new form', () => (
    <BaseStory
      open={boolean('open', true)}
      loading={boolean('loading', false)}
      initialForm={emptyForm}
    />
  ))
  .add('Update registered form', () => (
    <BaseStory
      open={boolean('open', true)}
      loading={boolean('loading', false)}
      initialForm={registeredForm}
    />
  ))
