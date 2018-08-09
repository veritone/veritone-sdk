import React from 'react';
import { storiesOf } from '@storybook/react';

import CreateFolderWidget from './';
import BaseStory from '../../shared/BaseStory';

storiesOf('Create Folder', module).add('Base', () => {
  const props = {
    rootFolderType: 'cms',
    parentFolderId: 'Test',
    parentFolderName: 'Parent Folder Name'
  };

  return (
    <BaseStory
      widget={CreateFolderWidget}
      widgetProps={{ ...props }}
    />
  );
});