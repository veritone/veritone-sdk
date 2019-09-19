import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text } from '@storybook/addon-knobs';
import CheckBoxes from './CheckBoxes';


storiesOf('FormBuilder/CheckBox', module)
  .add('Basic', () => (
    <CheckBoxes
      label="Checkbox"
      name="Checkbox-123"
      instruction="Select something"
      required={boolean('Required', false)}
      value={['option-1']}
      error={text('error', '')}
      items={[
        {
          id: '1',
          value: 'option-1'
        },
        {
          id: '2',
          value: 'option-2'
        }
      ]}
    />
  ))
