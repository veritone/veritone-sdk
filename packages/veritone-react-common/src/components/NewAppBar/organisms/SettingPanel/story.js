import React from 'react';
import { storiesOf } from '@storybook/react';
import Application from 'images/application.svg';
import User from 'images/user.svg';
import Org from 'images/orgSetting.svg';
import Preferences from 'images/preferences.svg';
import Activity from 'images/activity.svg';
import SettingPanel from './';

const tabsListDefault = [
  {
    id: 0,
    label: "Applications",
    icon: Application
  },
  {
    id: 1,
    label: "Personal Profile",
    icon: User
  },
  {
    id: 2,
    label: "ORGANIZATIONS",
    icon: Org
  },
  {
    id: 3,
    label: "Settings & Preferences",
    icon: Preferences
  },
  {
    id: 4,
    label: "Activity",
    icon: Activity
  }
]
const _noop = () => { }

window.config = { appVersion: 'Attribute App 2019.24.0' };
storiesOf('NewAppBar', module)
  .add('SettingPanel', () => (
    <React.Fragment>
      <SettingPanel
        open
        onClose={_noop}
        tabsList={tabsListDefault}
      />
    </React.Fragment>

  ))
  .add('SettingPanel close', () => (
    <SettingPanel
      open={false}
      onClose={_noop}
      tabsList={tabsListDefault}
    />
  ));