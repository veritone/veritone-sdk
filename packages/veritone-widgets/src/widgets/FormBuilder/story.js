import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import FormBuider from './';

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

const templateForm = {
  ...registeredForm,
  dataRegistryId: null,
  isTemplate: true
}


function BaseStory({ initialForm, ...props }) {
  const [form, setForm] = React.useState(initialForm);
  const onChangeFormDefinition = React.useCallback((formDefintion) => setForm({
    ...form,
    definition: formDefintion
  }));
  return <FormBuider form={form} onChange={onChangeFormDefinition} {...props} />
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
