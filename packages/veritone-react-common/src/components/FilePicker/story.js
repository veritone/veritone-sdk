import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FilePicker from './';

storiesOf('FilePicker', module)
  .add('Base', () => (
    <FilePicker
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ))
  .add('With Options', () => (
    <FilePicker
      accept={['image/svg+xml', '.png', '.jpg']}
      height={800}
      width={800}
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ));
