import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import FilePicker from '.';

storiesOf('FilePickerWidget', module).add('Base', () => {
  const token = text('Api Session Token', 'fixme');
  let pickerWidget;

  function makeApp() {
    return VeritoneApp({
      apiRoot: 'https://api.aws-dev.veritone.com'
    })
      .login({ token })
      .then(() => { // fixme -- try with OauthLoginButton
        pickerWidget = new FilePicker({
          elId: 'file-picker-widget',
          accept: ['image/*'],
          // allowUrlUpload: false
          multiple: false
        });

        return null;
      });
  }

  /* eslint-disable react/jsx-no-bind */
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
