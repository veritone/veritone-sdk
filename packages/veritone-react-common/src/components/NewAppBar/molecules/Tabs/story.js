import React from 'react';
import { storiesOf } from '@storybook/react';
import Application from 'images/application.svg';
import User from 'images/user.svg';
import Org from 'images/orgSetting.svg';
import Preferences from 'images/preferences.svg';
import Activity from 'images/activity.svg';

import Tabs from './';

const handleChangeTab = (id) => {
  console.log(id);
}

window.config = { appVersion: 'Attribute App 2019.24.0' };
const tabsList = [
  {
    id: 0,
    label: "Application",
    icon: Application
  },
  {
    id: 1,
    label: "User",
    icon: User
  },
  {
    id: 2,
    label: "Organization",
    icon: Org
  },
  {
    id: 3,
    label: "Preferences",
    icon: Preferences
  },
  {
    id: 4,
    label: "Activity",
    icon: Activity
  }
]
storiesOf('NewAppBar', module)
  .add('Tabs', () => (
    <Tabs
      selectedId={1}
      tabsList={tabsList}
      onChangeTab={handleChangeTab}
    />
  ))
  .add('Tabs Selected', () => (
    <Tabs
      selectedId={null}
      tabsList={tabsList}
      onChangeTab={handleChangeTab}
    />
  ));