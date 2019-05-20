import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import LeftNavigationPanel from './';

storiesOf('LeftNavigationPanel', module)
  .add('Full path list', () => {
    return (
      <LeftNavigationPanel
        currentPickerType={text('currentPickerType', 'folder')}
        showFolder={boolean('showFolder', true)}
        showStream={boolean('showStream', true)}
        showUpload={boolean('showUpload', true)}
        toggleFolderView={action('toggleFolderView')}
        toggleStreamView={action('toggleStreamView')}
        toggleUploadView={action('toggleUploadView')}
      />
    );
  })
