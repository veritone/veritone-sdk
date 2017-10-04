import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { AppBar } from 'veritone-react-common';

import VeritoneApp from './VeritoneApp';
import AppBarWidget from './TestAppBarWidget';

const app = new VeritoneApp(new AppBarWidget({ elId: 'appbar-widget'}));

storiesOf('VeritoneApp', module).add('Base', () => {
  return (
    <div>
      this is where the widget should go:
      <div id="appbar-widget" />
      <button onClick={app.mount.bind(app)}>Mount</button>
    </div>
    );
});
