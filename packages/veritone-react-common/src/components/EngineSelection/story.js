import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import EngineSelection from './';

storiesOf('Engine Selection', module).add('Base', () => {
  return (
    <div style={{ padding: '20px' }}>
      <EngineSelection />
    </div>
  );
});
