import React from 'react';
import { storiesOf } from '@storybook/react';

import ProgressDialog from './';

storiesOf('ProgressDialog', module)
  .add('Base', () => (
    <ProgressDialog
      percentComplete={20}
      progressMessage="getting urls"
    />
  ));
