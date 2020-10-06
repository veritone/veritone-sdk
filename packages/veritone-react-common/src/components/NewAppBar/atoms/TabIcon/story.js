import React from 'react';
import { storiesOf } from '@storybook/react';
import Application from 'images/application.svg';
import TabIcon from './';

const _noop = () => { }

window.config = { appVersion: 'Attribute App 2019.24.0' };
storiesOf('NewAppBar', module)
  .add('TabIcon', () => (
    <TabIcon
      selected={false}
      icon={Application}
      onClickTabIcon={_noop}
    />
  ))
  .add('TabIcon Selected', () => (
    <TabIcon
      selected
      icon={Application}
      onClickTabIcon={_noop}
    />
  ));