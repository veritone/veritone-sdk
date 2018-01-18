import React from 'react';
import { connect } from 'react-redux';
import { func, bool, string } from 'prop-types';

import { modules } from 'veritone-redux-common';
const { user: { userIsAuthenticated }, auth: { requestOAuthGrant }  } = modules;

import widget from '../../shared/widget';

@connect(
  state => ({
    userIsAuthenticated: userIsAuthenticated(state)
  }),
  { requestOAuthGrant },
  null,
  { withRef: true }
)
class OAuthLoginButton extends React.Component {
  static propTypes = {
    requestOAuthGrant: func.isRequired,
    userIsAuthenticated: bool.isRequired,
    OAuthURI: string.isRequired
  };

  handleLogin = () => {
    this.props.requestOAuthGrant(this.props.OAuthURI);
  };

  render() {
    return (
      !this.props.userIsAuthenticated && (
        <button onClick={this.handleLogin}>Log in with Veritone</button>
      )
    );
  }
}

export default widget(OAuthLoginButton);
