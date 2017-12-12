import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import FilePicker from '.';

storiesOf('FilePickerWidget', module).add('Base', () => {
  const app = new VeritoneApp([
    new FilePicker({
      elId: 'file-picker-widget',
      widgetId: 'picker',
      accept: ['video/*'],
      onUpload: files => console.log(files)
    })
  ]);

  const mountApp = app.mount.bind(app);
  const destroyApp = app.destroy.bind(app);
  const loginApp = app.login.bind(app);

  text('session token', 'fixme');

  return (
    <div>
      <div id="file-picker-widget" />
      <br />
      <br />
      <br />
      <br />
      <button onClick={mountApp}>1. Mount</button>
      <button onClick={loginApp}>2. login</button>
      <button onClick={destroyApp}>destroy</button>

      <br />
      <button onClick={() => app.getWidget('picker').open()}>
        3. pick files
      </button>
    </div>
  );
});
