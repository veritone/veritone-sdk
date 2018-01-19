import React from 'react';
import { bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { modules } from 'veritone-redux-common';
const { user } = modules;

import VeritoneApp from '../../shared/VeritoneApp';
import FilePicker from '.';

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
    this._picker = new FilePicker({
      elId: 'file-picker-widget',
      accept: ['image/*'],
      // allowUrlUpload: false
      multiple: true
    });
  }

  componentWillUnmount() {
    this._picker.destroy();
  }

  handleLogin = () => {
    return app.login({ sessionToken: this.props.sessionToken });
  };

  handlePick = () => {
    this._picker.pick(this.handlePickResult, this.handleCancelledPick);
  };

  handlePickResult = files => {
    this.setState({ result: files });
    console.log('Result: ', files);
  };

  handleCancelledPick = () => {
    console.log('Picking was cancelled');
  };

  render() {
    return (
      <span>
        {this.props.fetchUserFailed &&
          'failed to log in-- is your token wrong?'}
        {!this.props.userIsAuthenticated && (
          <button
            onClick={this.handleLogin}
            disabled={!this.props.sessionToken}
          >
            {this.props.sessionToken
              ? 'Log In'
              : 'Log In (Please set a token in the "Knobs" panel below)'}
          </button>
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


const app = VeritoneApp({
  apiRoot: 'https://api.aws-dev.veritone.com'
});


storiesOf('FilePickerWidget', module).add('Base', () => {
  const sessionToken = text('Api Session Token', '');

  return (
    <Story
      sessionToken={sessionToken}
      store={app._store}
    />
  );
});
