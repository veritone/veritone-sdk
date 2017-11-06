import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import AppBarWidget from './';

const app = new VeritoneApp(
  new AppBarWidget({
    elId: 'appbar-widget',
    title: 'test',
    profileMenu: true,
    appSwitcher: true
  })
);

storiesOf('AppBar', module).add('Base', () => {
  const token = text('Api Session Token', 'fixme');

  return (
    <div>
      this is where the widget should go:
      <div id="appbar-widget" />
      <br />
      <br />
      <br />
      <br />
      <button onClick={() => app.mount()}>Mount</button>
      <button onClick={() => app.destroy()}>destroy</button>
      <button onClick={() => app.login({ token })}>
        log in (set token in knobs panel)
      </button>
    </div>
  );
});
