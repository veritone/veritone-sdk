import React from 'react';
import { bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { AppContainer } from 'veritone-react-common';
import { modules } from 'veritone-redux-common';
const { user } = modules;

import VeritoneApp from '../../shared/VeritoneApp';
import OAuthLoginButton from '../OAuthLoginButton';
import AppBarWidget from './';

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
      clientId: 'fixme',
      redirectUri: window.origin
    });

    this._appBar = new AppBarWidget({
      elId: 'appBar-widget',
      title: 'AppBar Widget',
      profileMenu: true,
      appSwitcher: true
    });
  }

  componentWillUnmount() {
    this._appBar.destroy();
    this._oauthButton.destroy();
    this._oauthButtonImplicit.destroy();
  }

  handleLogin = () => {
    return app.login({ sessionToken: this.props.sessionToken });
  };

  render() {
    return (
      <div>
        <span id="appBar-widget" />

        <AppContainer appBarOffset>
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
        </AppContainer>
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('AppBar', module).add('Base', () => {
  const sessionToken = text('Api Session Token', '');

  return <Story sessionToken={sessionToken} store={app._store} />;
});
