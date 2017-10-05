import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import VeritoneApp from './shared/VeritoneApp';
import AppBarWidget from './widgets/AppBar';

const app = new VeritoneApp(
  new AppBarWidget({ elId: 'error-display', title: 'test', profileMenu: true, appSwitcher: true })
);

storiesOf('VeritoneApp', module).add('Base', () => {
  return (
    <div>
      this is where the widget should go:
      <div id="appbar-widget" />
      <br />
      <br />
      <br />
      <br />
      <button onClick={app.mount.bind(app)}>Mount</button>
      <button onClick={app.destroy.bind(app)}>destroy</button>
    </div>
  );
});
