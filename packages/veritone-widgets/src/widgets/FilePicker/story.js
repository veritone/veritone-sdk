import React from 'react';
import { bool } from 'prop-types';
import { connect } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { modules } from 'veritone-redux-common';
const { user } = modules;

import VeritoneApp from '../../shared/VeritoneApp';
import FilePicker from '.';

const app = VeritoneApp({
  apiRoot: 'https://api.aws-dev.veritone.com'
});

class _Story extends React.Component {
  static propTypes = {
    userIsAuthenticated: bool
  };

  componentDidMount() {
    this._picker = new FilePicker({
      elId: 'file-picker-widget',
      id: 'p1',
      accept: ['image/*'],
      // allowUrlUpload: false
      multiple: false
    });
  }

  handlePick = () => {
    this._picker.pick(this.handlePickResult, this.handleCancelledPick);
  };

  handlePickResult = (...args) => {
    console.log('Result: ', args);
  };

  handleCancelledPick = () => {
    console.log('Picking was cancelled');
  };

  render() {
    const disabled = !this.props.userIsAuthenticated;

    return (
      <span>
        <span id="file-picker-widget" />
        <button disabled={disabled} onClick={this.handlePick}>
          {disabled ? 'Pick files (Log in first)' : 'Pick files'}
        </button>
      </span>
    );
  }
}

const Story = connect(state => ({
  userIsAuthenticated: user.userIsAuthenticated(state)
}))(_Story);

storiesOf('FilePickerWidget', module).add('Base', () => {
  const sessionToken = text('Api Session Token', '');

  function login() {
    return app.login({ sessionToken });
  }

  return (
    <div>
      <p>
        1.&nbsp;
        <button onClick={login} disabled={!sessionToken}>
          {sessionToken
            ? 'Log In'
            : 'Log In (Please set a token in the "Knobs" panel below)'}
        </button>
      </p>
      <p>
        2.&nbsp;
        <Story disabled={!!sessionToken} store={app._store} />
      </p>
    </div>
  );
});
