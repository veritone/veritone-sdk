import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import DataPicker from './';

storiesOf('DataPicker', module)
  .add('Loading', () => (
    <DataPicker
        triggerPagination={action('triggerPagination')}
    />
  ))
