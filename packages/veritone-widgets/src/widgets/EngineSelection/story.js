import React from 'react';
import { bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { modules } from 'veritone-redux-common';
const { user } = modules;

import devConfig from '../../../config.dev.json';
import VeritoneApp from '../../shared/VeritoneApp';
import OAuthLoginButton from '../OAuthLoginButton';

import EngineSelectionWidget from './';

@connect(state => ({
  userIsAuthenticated: user.userIsAuthenticated(state),
  fetchUserFailed: user.fetchingFailed(state)
}))
class Story extends React.Component {
  static propTypes = {
    userIsAuthenticated: bool,
    fetchUserFailed: bool,
    sessionToken: string
  };

  componentDidMount() {
    this._oauthButton = new OAuthLoginButton({
      mode: 'authCode',
      elId: 'login-button-widget-auth-code',
      OAuthURI: 'http://local.veritone-sample-app.com:5001/auth/veritone'
    });

    this._oauthButtonImplicit = new OAuthLoginButton({
      mode: 'implicit',
      elId: 'login-button-widget-implicit',
      clientId: devConfig.clientId,
      redirectUri: window.origin
    });

    this._engineSelection = new EngineSelectionWidget({
      elId: 'engine-selection-widget',
      onSave: noop,
      onCancel: noop
    });
  }

  componentWillUnmount() {
    this._engineSelection.destroy();
    this._oauthButton.destroy();
    this._oauthButtonImplicit.destroy();
  }

  handleLogin = () => {
    return app.login({ sessionToken: this.props.sessionToken });
  };

  render() {
    return (
      <span>
        {this.props.fetchUserFailed &&
          'failed to log in-- is your token wrong?'}
        {!this.props.userIsAuthenticated && (
          <div>
            <p>
              <button
                onClick={this.handleLogin}
                disabled={!this.props.sessionToken}
              >
                {this.props.sessionToken
                  ? 'Log In via session token'
                  : 'Log In via session token (Please set a token in the "Knobs" panel below)'}
              </button>
            </p>
            or log in via oauth:
            <p>
              implicit:
              <span id="login-button-widget-implicit" />
              auth code:
              <span id="login-button-widget-auth-code" />
            </p>
          </div>
        )}

        <span id="engine-selection-widget" />
      </span>
    );
  }
}

const app = VeritoneApp();

storiesOf('EngineSelectionWidget', module).add('Base', () => {
  const sessionToken = text('Api Session Token', '');

  return <Story sessionToken={sessionToken} store={app._store} />;
});
