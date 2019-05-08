import React from 'react';
import { noop } from 'lodash';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import EnginePicker, { EnginePickerWidget } from '.';

import MultipleEnginePicker, {
  MultipleEnginePickerWidget
} from './MultiplePicker';

storiesOf('EnginePicker', module).add('Single Picker', () => {
  const props = {
    onSave: noop,
    onCancel: noop
  };

  return (
    <div style={{ width: '600px', height: '500px' }}>
      <BaseStory
        widget={EnginePickerWidget}
        widgetProps={{ ...props }}
        componentClass={EnginePicker}
        componentProps={{ ...props }}
      />
    </div>
  );
});

storiesOf('EnginePicker', module).add('Multiple Picker', () => {
  const props = {
    onSave: noop,
    onCancel: noop
  };

  return (
    <BaseStory
      widget={MultipleEnginePickerWidget}
      widgetProps={{ ...props }}
      componentClass={MultipleEnginePicker}
      componentProps={{ ...props }}
    />
  );
});
