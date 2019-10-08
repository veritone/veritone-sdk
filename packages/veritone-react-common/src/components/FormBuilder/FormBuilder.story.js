import React from 'react';
import { storiesOf } from '@storybook/react';
import FormBuilder from './FormBuilder';

function BasicFormBuilder() {
  const [
    form, setForm
  ] = React.useState([
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
  ]);

  return (
   <FormBuilder form={form} onChange={setForm} />
  );
}


storiesOf('FormBuilder/FormBuilder', module)
  .add('Display form builder', () => (
    <BasicFormBuilder />
  ))
