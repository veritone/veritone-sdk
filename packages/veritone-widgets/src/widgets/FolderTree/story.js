import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import { FolderTreeWidget } from './';

storiesOf('FolderTree', module).add('Base', () => {
  const folderActionDefault = [
    {
      id: 1,
      type: 'move',
      name: 'Move'
    },
    {
      id: 2,
      type: 'delete',
      name: 'Delete'
    },
    {
      id: 3,
      type: 'edit',
      name: 'Edit'
    }
  ]
  const props = {
    type: 'cms',
    isEnableShowContent: false,
    selectable: false,
    enableSearchbox: false,
    folderAction: folderActionDefault,
    onSelectMenuItem: (type, item) => console.log(type, item),
    handleSelectedFoler: (selectedFolder) => console.log(selectedFolder),
  };

  return (
    <BaseStory
      widget={FolderTreeWidget}
      widgetProps={{ ...props, title: 'AppBar Widget' }}
    />
  );
});
