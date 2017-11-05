import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';
import OAuthLoginButtonWidget from './';


storiesOf('OAuthLoginButtonWidget', module).add('Base', () => {
  const app = new VeritoneApp(
    new OAuthLoginButtonWidget({
      elId: 'login-button-widget',
      OAuthURI: 'http://localhost:5001/auth.veritone'
    })
  );

  const mountApp = app.mount.bind(app);
  const destroyApp = app.destroy.bind(app);

  return (
    <div>
      <div id="login-button-widget"/>
      <br/>
      <br/>
      <br/>
      <br/>
      <button onClick={mountApp}>Mount</button>
      <button onClick={destroyApp}>destroy</button>
    </div>
  );
});
