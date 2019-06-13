import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CreateLocation from './';


storiesOf('CreateLocation', module)
  .add('Base', () => (
    <CreateLocation
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ));
