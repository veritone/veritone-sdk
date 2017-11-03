import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from './shared/VeritoneApp';
import AppBarWidget from './widgets/AppBar';

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

storiesOf('VeritoneApp', module).add('Base', () => {
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
    </div>
  );
});
