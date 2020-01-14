import React from 'react';
import { connect } from 'react-redux';
import { func, bool, string, oneOf } from 'prop-types';

import { modules } from 'veritone-redux-common';
const {
  user: { userIsAuthenticated },
  auth: { requestOAuthGrant, requestOAuthGrantImplicit },
  config: { getConfig }
} = modules;
import { OAuthLoginButton as OAuthLoginButtonComponent } from 'veritone-react-common';

import widget from '../../shared/widget';

@connect(
  state => ({
    userIsAuthenticated: userIsAuthenticated(state),
    apiRoot: getConfig(state).apiRoot
  }),
  { requestOAuthGrant, requestOAuthGrantImplicit },
  null,
  { forwardRef: true }
)
class OAuthLoginButton extends React.Component {
  static propTypes = {
    requestOAuthGrant: func.isRequired,
    requestOAuthGrantImplicit: func.isRequired,
    userIsAuthenticated: bool.isRequired,
    mode: oneOf(['implicit', 'authCode']),
    onAuthSuccess: func,
    onAuthFailure: func,
    apiRoot: string.isRequired,
    OAuthURI: string,
    // required params for implicit grant only:
    responseType: string,
    scope: string,
    redirectUri: string,
    clientId: string
  };

  static defaultProps = {
    mode: 'implicit'
  };

  handleLogin = () => {
    /* prettier-ignore */
    const defaultImplicitGrantURI = `${this.props.apiRoot}/v1/admin/oauth/authorize`;

    const OAuthURI =
      this.props.OAuthURI ||
      (this.props.mode === 'implicit' ? defaultImplicitGrantURI : undefined);

    const grantFn = {
      implicit: this.props.requestOAuthGrantImplicit,
      authCode: this.props.requestOAuthGrant
    }[this.props.mode];

    grantFn({
      OAuthURI,
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
        <OAuthLoginButtonComponent {...this.props} onClick={this.handleLogin} />
      )
    );
  }
}

const OAuthLoginButtonWidget = widget(OAuthLoginButton);
export { OAuthLoginButton as default, OAuthLoginButtonWidget };
