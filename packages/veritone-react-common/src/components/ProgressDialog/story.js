import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, select, text, boolean } from '@storybook/addon-knobs';

import ProgressDialog from './';

storiesOf('ProgressDialog', module).add('Base', () => {
  const complete = boolean('complete');
  const completeStatus = select('completeStatus', {
    success: 'success',
    failure: 'failure',
    warning: 'warning'
  });

  return (
    <ProgressDialog
      percentComplete={number('percentComplete', 20)}
      progressMessage={text('progressMessage', 'retrieving signed URLs')}
      completeStatus={complete ? completeStatus : null}
    />
  );
});
