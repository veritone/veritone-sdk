import React from 'react';

import widget from '../../shared/widget';

class OAuthLoginButton extends React.Component {
  render() {
    return <button>Log in with Veritone</button>;
  }
}

export default widget(OAuthLoginButton);
