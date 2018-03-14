import React from 'react';
import { func, string } from 'prop-types';
import { connect } from 'react-redux';
import { AppBar as LibAppBar } from 'veritone-react-common';
import { modules } from 'veritone-redux-common';
const { user, config } = modules;

import widget from '../../shared/widget';

@connect(
  state => ({
    user: user.selectUser(state),
    enabledApps: user.selectEnabledApps(state),
    enabledAppsFailedLoading: user.enabledAppsFailedLoading(state),
    isFetchingApps: user.isFetchingApps(state),
    switchAppRoute: config.getConfig(state).switchAppRoute
  }),
  { fetchEnabledApps: user.fetchEnabledApps },
  null,
  { withRef: true }
)
class AppBar extends React.Component {
  static propTypes = {
    fetchEnabledApps: func,
    switchAppRoute: string.isRequired
  };

  componentDidMount() {
    this.props.fetchEnabledApps();
  }

  veritoneAppDidAuthenticate = () => {
    this.props.fetchEnabledApps();
  };

  handleSwitchApp = id => {
    window.location = `${this.props.switchAppRoute}/${id}`;
  };

  render() {
    return <LibAppBar {...this.props} onSwitchApp={this.handleSwitchApp} />;
  }
}

export default widget(AppBar);
