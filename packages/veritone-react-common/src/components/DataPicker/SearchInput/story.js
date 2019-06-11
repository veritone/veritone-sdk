import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import SearchInput from './';

storiesOf('DataPicker', module)
  .add('SearchInput: Basic', () => (
    <SearchInput
      onSearch={action('onSearch')}
      value={text('value', 'search')}
      onClear={action('onClear')}
    />
  ))
