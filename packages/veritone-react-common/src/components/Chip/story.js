import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Chip from './';

storiesOf('Chip', module).add('hover button', () => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <Chip label="5 filters" hoveredLabel="Clear" onClick={action('clicked')} />
  );
});
