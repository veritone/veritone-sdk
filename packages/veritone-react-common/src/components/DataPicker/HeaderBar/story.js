import React from 'react';
import { storiesOf } from '@storybook/react';

import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import HeaderBar from './';

storiesOf('DataPicker', module)
  .add('HeaderBar: Basic', () => (
    <HeaderBar
      pathList={[
        {
          name: 'Parent',
          id: '1'
        },
        {
          name: 'Child',
          id: '2'
        }
      ]}
      viewType={text('viewType', 'list')}
      onUpload={action('onUpload')}
      onSort={action('onSort')}
      onSearch={action('onSearch')}
      onCrumbClick={action('onCrumbClick')}
      onBack={action('onBack')}
      onClear={action('onClear')}
      onToggleView={action('onToggleView')}
      currentPickerType={text('currentPickerType', 'folder')}
    />
  ))