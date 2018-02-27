import React from 'react';
import { connect } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { bool, string } from 'prop-types';
import { text } from '@storybook/addon-knobs';
import { modules } from 'veritone-redux-common';
const { user } = modules;

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
      elId: 'login-button-widget',
      OAuthURI: 'http://localhost:5001/auth/veritone'
    });

    this._engineSelection = new EngineSelectionWidget({
      elId: 'engine-selection-widget'
    });
  }

  componentWillUnmount() {
    this._engineSelection.destroy();
    this._oauthButton.destroy();
  }

  handleLogin = () => {
    return app.login({ sessionToken: this.props.sessionToken });
  };


  render() {
    // return (
    //   <div>
    //     <span id="engine-selection-widget" />
    //   </div>
    // );

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
  
          <span id="engine-selection-widget" />
  
          {this.props.userIsAuthenticated && (
            <button
              disabled={!this.props.userIsAuthenticated}
              onClick={this.handlePick}
            >
              Pick files
            </button>
          )}
{/*   
          {this.state.result && (
            <pre>
              Result:
              {JSON.stringify(this.state.result, null, '\t')}
            </pre>
          )} */}
        </span>
      );
  }
}


const app = VeritoneApp();

storiesOf('EngineSelectionWidget', module).add('Base', () => {
  // const app = new VeritoneApp([
  //   new EngineSelectionWidget({
  //     elId: 'engine-selection-widget'
  //   })
  // ]);

  // const mountApp = app.mount.bind(app);
  // const destroyApp = app.destroy.bind(app);

  const sessionToken = text('Api Session Token', '');
  
  return <Story sessionToken={sessionToken} store={app._store} />;

  // return (
  //   <div>
  //     <div id="engine-selection-widget"/>
  //     <br/>
  //     <br/>
  //     <br/>
  //     <br/>
  //     <button onClick={mountApp}>Mount</button>
  //     <button onClick={destroyApp}>destroy</button>
  //   </div>
  // )
});
