import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import AppBarWidget from './';


storiesOf('AppBar', module).add('Base', () => {
  const token = text('Api Session Token', 'fixme');

  function makeApp() {
    return VeritoneApp({
      apiRoot: 'https://api.aws-dev.veritone.com'
    })
      .login({ token })
      .then(() => { // fixme -- try with OauthLoginButton
         new AppBarWidget({
          elId: 'appbar-widget',
          title: 'test',
          profileMenu: true,
          appSwitcher: true
        });
      });
  }
  /* eslint-disable react/jsx-no-bind */
  return (
    <div>
      this is where the widget should go:
      <div id="appbar-widget" />
      <br />
      <br />
      <br />
      <button onClick={makeApp}>1. Mount and authenticate</button>
    </div>
  );
});
