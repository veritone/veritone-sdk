import React from 'react';
import { storiesOf } from '@storybook/react';
import { TranscriptSearchModal } from './';

storiesOf('TranscriptSearchModal', module).add('Base', () => {
  const logFilter = value => console.log('filter value', value);
  return (
    <TranscriptSearchModal
      open
      state={{ value: 'Lakers' }}
      applyFilter={logFilter}
    />
  );
});
