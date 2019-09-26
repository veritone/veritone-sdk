import React from 'react';
import { storiesOf } from '@storybook/react';

import FolderItem from './FolderItem';
import RootFolderItem from './RootFolder';
import FolderTree from './';

storiesOf('FolderTree', module).add('Folder Item', () => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <FolderItem opening hasContent folderName="Collection folder" />
    </div>
  );
}).add('Root Folder Item', () => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <RootFolderItem selecting={false} folderName="My Organization" />
    </div>
  );
}).add('Folder Tree', () => {
  /* eslint-disable react/jsx-no-bind */
  return (
    <div style={{
      width: 500,
      height: 500
    }}>
      <FolderTree />
    </div>
  );
});
