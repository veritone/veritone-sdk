import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import AppBar, { AppBarWidget } from './';

storiesOf('AppBar', module)
  .add('Base', () => {
    const props = {
      profileMenu: true,
      appSwitcher: true,
      onLogout: () => console.log('log out')
    };

    return (
      <BaseStory
        widget={AppBarWidget}
        widgetProps={{ ...props, title: 'AppBar Widget' }}
        componentClass={AppBar}
        componentProps={{ ...props, title: 'AppBar Component' }}
      />
    );
  })
  .add('Discovery Settings', () => {
    const props = {
      profileMenu: true,
      appSwitcher: true,
      onLogout: () => console.log('log out'),
      isDiscovery: true
    };

    return (
      <BaseStory
        widget={AppBarWidget}
        widgetProps={{ ...props, title: 'AppBar Widget' }}
        componentClass={AppBar}
        componentProps={{ ...props, title: 'AppBar Component' }}
      />
    );
  });
