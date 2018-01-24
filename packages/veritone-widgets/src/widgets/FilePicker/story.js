import React from 'react';
import { bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { modules } from 'veritone-redux-common';
const { user } = modules;

import VeritoneApp from '../../shared/VeritoneApp';
import FilePicker from '.';
import OAuthLoginButton from '../OAuthLoginButton';

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

  state = {
    result: null
  };

  componentDidMount() {
    this._oauthButton = new OAuthLoginButton({
      elId: 'login-button-widget',
      OAuthURI: 'http://localhost:5001/auth/veritone'
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
              <span id="login-button-widget" />
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
