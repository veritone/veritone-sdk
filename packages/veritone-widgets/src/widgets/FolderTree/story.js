import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import FolderTree, { FolderTreeWidget } from './';

storiesOf('FolderTree', module).add('Base', () => {
  const props = {
    profileMenu: true,
    appSwitcher: true,
    onLogout: () => console.log('log out')
  };

  return (
    <BaseStory
      widget={FolderTreeWidget}
      widgetProps={{ ...props, title: 'AppBar Widget' }}
      componentClass={FolderTree}
      componentProps={{ ...props, title: 'AppBar Component' }}
    />
  );
});
