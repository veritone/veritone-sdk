import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import EngineOutputNullState from './';

const engineName = 'FooScription';

storiesOf('EngineOutputNullState', module).add('Processing', () => {
  return (
    <EngineOutputNullState engineStatus={'running'} engineName={engineName} />
  );
});

storiesOf('EngineOutputNullState', module).add('Error', () => {
  return (
    <EngineOutputNullState
      engineStatus={'failed'}
      engineName={engineName}
      onRunProcess={action('rerun process')}
    />
  );
});
