import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import { FolderTreeWidget } from './';

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
    />
  );
});
