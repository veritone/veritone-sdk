import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Nullstate from './Nullstate';

storiesOf('SourceManagement', module)
  .add('Nullstate', () => (
    <Nullstate />
  ))