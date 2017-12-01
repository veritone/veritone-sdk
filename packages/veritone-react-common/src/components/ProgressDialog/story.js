import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, boolean, text } from '@storybook/addon-knobs';

import ProgressDialog from './';

storiesOf('ProgressDialog', module).add('Base', () => (
  <ProgressDialog
    percentComplete={number('percentComplete', 20)}
    progressMessage={text('progressMessage', 'retrieving signed URLs')}
    doneSuccess={boolean('doneSuccess', false)}
    doneFailure={boolean('doneFailure', false)}
  />
));
