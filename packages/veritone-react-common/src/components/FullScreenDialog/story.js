import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import FullScreenDialog from './';

storiesOf('FullScreenDialog', module).add('Base', () => (
  <div style={{ height: '100%', width: '100%', background: 'lightgrey' }}>
    <h2>Use the Knobs panel to open a dialog</h2>
    <FullScreenDialog open={boolean('Open', false)}>
      <div
        style={{
          height: 60,
          width: '100vw',
          background: '#2196f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <h3>My Veritone App</h3>
      </div>
      <p>Use the Knobs panel to close this dialog</p>
    </FullScreenDialog>
  </div>
));
