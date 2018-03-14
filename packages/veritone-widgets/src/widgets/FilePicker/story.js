import React from 'react';
import { bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { modules } from 'veritone-redux-common';
const { user, config } = modules;

import devConfig from '../../../config.dev.json';
import VeritoneApp from '../../shared/VeritoneApp';
import FilePicker from '.';
import OAuthLoginButton from '../OAuthLoginButton';

@connect((state, ownProps) => ({
  userIsAuthenticated: user.userIsAuthenticated(state),
  fetchUserFailed: user.fetchingFailed(state),
  apiRoot: config.getConfig(ownProps.store.getState()).apiRoot
}))
class Story extends React.Component {
  static propTypes = {
    userIsAuthenticated: bool,
    fetchUserFailed: bool,
    sessionToken: string,
    apiRoot: string.isRequired
  };

  state = {
    result: null
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
      OAuthURI: `${this.props.apiRoot}/v1/admin/oauth/authorize`,
      clientId: devConfig.clientId,
      redirectUri: window.origin
    });

    this._picker = new FilePicker({
      elId: 'file-picker-widget',
      accept: ['image/*'],
      // allowUrlUpload: false
      multiple: true
    });
  }

  componentWillUnmount() {
    this._picker.destroy();
    this._oauthButton.destroy();
    this._oauthButtonImplicit.destroy();
  }

  handleLogin = () => {
    return app.login({ sessionToken: this.props.sessionToken });
  };

  handlePick = () => {
    this._picker.pick(this.handlePickResult);
  };

  handlePickResult = (files, { warning, error, cancelled }) => {
    if (cancelled) {
      return this.handleCancelledPick();
    }

    if (error) {
      return this.handlePickError(error)
    }

    if (warning) {
      this.handlePickWarning(warning)
    }

    this.setState({ result: files });
    console.log('Result: ', files);
  };

  handleCancelledPick = () => {
    console.log('Picking was cancelled');
  };

  handlePickError = (error) => {
    console.log('Picking failed with error:', error);
  };

  handlePickWarning = (warning) => {
    console.log('Pick resulted in a warning:', warning);
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
              <span id="login-button-widget-implicit"/>
              auth code:
              <span id="login-button-widget-auth-code"/>
            </p>
          </div>
        )}

        <span id="file-picker-widget" />

        {this.props.userIsAuthenticated && (
          <button
            disabled={!this.props.userIsAuthenticated}
            onClick={this.handlePick}
          >
            Pick files
          </button>
        )}

        {this.state.result && (
          <pre>
            Result:
            {JSON.stringify(this.state.result, null, '\t')}
          </pre>
        )}
      </span>
    );
  }
}

const app = VeritoneApp();

storiesOf('FilePickerWidget', module).add('Base', () => {
  const sessionToken = text('Api Session Token', '');

  return <Story sessionToken={sessionToken} store={app._store} />;
});
