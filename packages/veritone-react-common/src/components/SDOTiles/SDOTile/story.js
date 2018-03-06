import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SDOTile from './'

storiesOf('SDOTile', module)
  .add('Base', () => (
    <SDOTile/>
  ))