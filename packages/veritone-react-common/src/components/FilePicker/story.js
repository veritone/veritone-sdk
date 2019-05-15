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
  ))
  .add('With Multiple', () => (
    <FilePicker
      accept={['image/svg+xml', '.png', '.jpg']}
      height={800}
      width={800}
      multiple
      maxFiles={2}
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ))
  .add('Flat on a page', () => (
    <FilePicker
      accept={['image/svg+xml', '.png', '.jpg']}
      height={800}
      width={800}
      onPickFiles={action('upload files')}
      multiple
      allowUrlUpload={false}
    />
  ))
  .add('Flat on a page with max file limit', () => (
    <FilePicker
      accept={['image/svg+xml', '.png', '.jpg']}
      height={800}
      width={800}
      onPickFiles={action('upload files')}
      multiple
      maxFiles={5}
      allowUrlUpload={false}
    />
  ))
  .add('Flat with scrollbars', () => (
    <div style={{ height: '500px', width: '600px' }}>
      <FilePicker
        accept={['image/svg+xml', '.png', '.jpg']}
        height={'100%'}
        multiple
        onPickFiles={action('upload files')}
        allowUrlUpload={false}
      />
    </div>
  ));
