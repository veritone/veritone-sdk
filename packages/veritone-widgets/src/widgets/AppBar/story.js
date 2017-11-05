import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';
import AppBarWidget from './';

import { login } from '../../shared/VeritoneAuth';
const handleLogin = () =>
  login('http://localhost:5001/auth/veritone')
    .then(a => console.log(a))
    .catch(e => console.log('error', e));

const app = new VeritoneApp(
  new AppBarWidget({
    elId: 'appbar-widget',
    title: 'test',
    profileMenu: true,
    appSwitcher: true
  })
);

const mountApp = app.mount.bind(app);
const destroyApp = app.destroy.bind(app);

storiesOf('AppBar', module).add('Base', () => {
  return (
    <div>
      this is where the widget should go:
      <div id="appbar-widget" />
      <br />
      <br />
      <br />
      <br />
      <button onClick={mountApp}>Mount</button>
      <button onClick={destroyApp}>destroy</button>
      <button onClick={handleLogin}>log in</button>
    </div>
  );
});
