import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';
import OAuthLoginButtonWidget from '.';

storiesOf('OAuthLoginButtonWidget', module).add('Base', () => {
  VeritoneApp({
    apiRoot: 'https://api.aws-dev.veritone.com'
  });

  function makeApp() {
    new OAuthLoginButtonWidget({
      elId: 'login-button-widget',
      OAuthURI: 'http://localhost:5001/auth/veritone'
    });
  }

  return (
    <div>
      <div id="login-button-widget" />
      <br />
      <br />
      <br />
      <br />
      <button onClick={makeApp}>1. Make app</button>
    </div>
  );
});
