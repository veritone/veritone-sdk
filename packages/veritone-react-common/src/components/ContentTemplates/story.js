import React from 'react';
import { storiesOf } from '@storybook/react';
import { noop } from 'lodash';
import NullState from './NullState';
import TemplateList from './TemplateList';
import TemplateForms from './TemplateForms';
import ContentTemplateForm from './ContentTemplateForm';
import { templateData, initialTemplates } from './sample-data';

function logFormData(formData) {
  console.log(formData);
}

const fakeSchemaOptions = [
  {
    name: 'name0',
    id: 0
  },
  {
    name: 'name1',
    id: 1
  },
  {
    name: 'name2',
    id: 2
  }
];

const getFieldOptions = query => {
  console.log('Executed Query: ' + query);
  return Promise.resolve(fakeSchemaOptions);
};

storiesOf('Content Templates', module)
  .add('Null State', () => <NullState />)
  .add('Template List', () => (
    <TemplateList
      templates={templateData}
      addTemplate={noop}
      removeTemplate={noop}
    />
  ))
  .add('Form Cards', () => (
    <TemplateForms
      templates={initialTemplates}
      onTemplateDetailsChange={noop}
      onRemoveTemplate={noop}
      getFieldOptions={getFieldOptions}
    />
  ))
  .add('Form', () => (
    <ContentTemplateForm
      templateData={templateData}
      initialTemplates={initialTemplates}
      getFieldOptions={getFieldOptions}
      onSubmit={logFormData}
    />
  ));
