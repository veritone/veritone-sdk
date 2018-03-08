import React from 'react';
import { connect } from 'react-redux';
import { func, bool, string, oneOf } from 'prop-types';

import { modules } from 'veritone-redux-common';
const {
  user: { userIsAuthenticated },
  auth: { requestOAuthGrant, requestOAuthGrantImplicit }
} = modules;

import widget from '../../shared/widget';

@connect(
  state => ({
    userIsAuthenticated: userIsAuthenticated(state)
  }),
  { requestOAuthGrant, requestOAuthGrantImplicit },
  null,
  { withRef: true }
)
class OAuthLoginButton extends React.Component {
  static propTypes = {
    requestOAuthGrant: func.isRequired,
    requestOAuthGrantImplicit: func.isRequired,
    userIsAuthenticated: bool.isRequired,
    OAuthURI: string.isRequired,
    mode: oneOf(['implicit', 'auth-code']),
    onAuthSuccess: func,
    onAuthFailure: func
  };

  static defaultProps = {
    mode: 'implicit'
  };

  handleLogin = () => {
    const grantFn = {
      implicit: this.props.requestOAuthGrantImplicit,
      'auth-code': this.props.requestOAuthGrant
    }[this.props.mode];

    grantFn(
      this.props.OAuthURI,
      this.props.onAuthSuccess,
      this.props.onAuthFailure
    );
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
