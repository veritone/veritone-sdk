import React from 'react';
import Work from '@material-ui/icons/Work';
import { storiesOf } from '@storybook/react';

import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import HeaderBar from './';

storiesOf('HeaderBar', module)
  .add('Basic', () => (
    <HeaderBar
      isStream={boolean('isStream', false)}
      pathList={[
        {
          icon: <Work style={{ color: "blue" }} />,
          id: '1'
        },
        {
          label: 'Child',
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
    />
  ))