import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ModalHeader from './';

storiesOf('ModalHeader', module)
  .add('Base', () => (
    <ModalHeader title={'Fullscreen'} icons={['help', 'menu', 'trash', 'exit']}/>
  ))