import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SDOTiles from './'

storiesOf('SDOTiles', module)
  .add('Base', () => (
    <SDOTiles/>
  ))