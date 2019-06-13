import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AdvancedPanel from './';


storiesOf('AdvancedSearchPanel', module)
  .add('Base', () => (
    <AdvancedPanel
      onPickFiles={action('upload files')}
      onRequestClose={action('close modal')}
    />
  ));
