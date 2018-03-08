import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DataSetFullscreen from './'

storiesOf('DataSetFullscreen', module)
  .add('Base', () => (
    <DataSetFullscreen/>
  ))