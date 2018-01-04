import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import FilePicker from '.';

storiesOf('FilePickerWidget', module).add('Base', () => {
  // const app = new VeritoneApp([
  //   new FilePicker({
  //     elId: 'file-picker-widget',
  //     widgetId: 'picker',
  //     accept: ['video/*'],
  //     onUpload: files => console.log(files)
  //   })
  // ]);
  //
  // const mountApp = app.mount.bind(app);
  // const destroyApp = app.destroy.bind(app);
  // const loginApp = app.login.bind(app);
  const token = text('session token', 'fixme');
  let pickerWidget;

  function makeApp() {
    return VeritoneApp({
      apiRoot: 'https://api.aws-dev.veritone.com'
    })
      .login({ token })
      .then(() => { // fixme -- try with OauthLoginButton
        pickerWidget = new FilePicker({
          elId: 'file-picker-widget',
          accept: ['image/*']
        });
      });
  }

  return (
    <div>
      <div id="file-picker-widget" />
      <br />
      <br />
      <br />
      <br />
      <button onClick={makeApp}>1. make</button>

      <br />
      <button onClick={() => pickerWidget.pick((...args) => console.log(args))}>2. pick files</button>
    </div>
  );
});
