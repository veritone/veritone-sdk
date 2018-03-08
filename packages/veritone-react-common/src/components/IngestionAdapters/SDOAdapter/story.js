import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SDOAdapterObj from './';
const SDOAdapter = SDOAdapterObj.adapter;

storiesOf('SDOAdapter', module)
  .add('SDOAdapter', () => <SDOAdapter/>);
