import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import AppBar, { AppBarWidget } from './';

storiesOf('AppBar', module).add('Base', () => {
  const props = {
    profileMenu: true,
    appSwitcher: true
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
