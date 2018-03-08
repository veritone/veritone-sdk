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
    mode: oneOf(['implicit', 'authCode']),
    onAuthSuccess: func,
    onAuthFailure: func,
    OAuthURI: string.isRequired,
    // required params for implicit grant only:
    responseType: string,
    scope: string,
    redirectUri: string,
    clientId: string,
  };

  static defaultProps = {
    mode: 'implicit'
  };

  handleLogin = () => {
    const grantFn = {
      implicit: this.props.requestOAuthGrantImplicit,
      authCode: this.props.requestOAuthGrant
    }[this.props.mode];

    grantFn({
      OAuthURI: this.props.OAuthURI,
      responseType: this.props.responseType,
      scope: this.props.scope,
      clientId: this.props.clientId,
      redirectUri: this.props.redirectUri,
      onSuccess: this.props.onAuthSuccess,
      onFailure: this.props.onAuthFailure
    });
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
