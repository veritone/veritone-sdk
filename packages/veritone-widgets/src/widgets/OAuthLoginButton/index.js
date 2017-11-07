import React from 'react';
import { connect } from 'react-redux';
import { func, bool } from 'prop-types';

import { modules } from 'veritone-redux-common';
const { user: { userIsAuthenticated } } = modules;

import { requestOAuthGrant} from '../../redux/modules/oauth'
import widget from '../../shared/widget';

@connect(
  state => ({
    userIsAuthenticated: userIsAuthenticated(state)
  }),
  { requestOAuthGrant }
)
class OAuthLoginButton extends React.Component {
  static propTypes = {
    requestOAuthGrant: func.isRequired,
    userIsAuthenticated: bool.isRequired
  };

  handleLogin = () => {
    this.props.requestOAuthGrant();
    // todo: make an oauth saga from andrew's oauth functions.
    // the saga should end by firing off fetchUser with the received token.
    // then dispatch the action to kick that off from here.
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
