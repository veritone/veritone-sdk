import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FilePicker from './';

storiesOf('FilePicker', module)
  .add('Base', () => (
    <FilePicker
      isOpen
      onUploadFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ))
  .add('With Options', () => (
    <FilePicker
      isOpen
      accept={['image/svg+xml', '.png']}
      height={400}
      width={600}
      onUploadFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ));
