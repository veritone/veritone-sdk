import React from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { AppBar as LibAppBar } from 'veritone-react-common';
import { modules } from 'veritone-redux-common';
const { user } = modules;
import widget from '../../shared/widget';

@connect(
  state => ({
    user: user.selectUser(state),
    enabledApps: user.selectEnabledApps(state),
    enabledAppsFailedLoading: user.enabledAppsFailedLoading(state),
    isFetchingApps: user.isFetchingApps(state)
  }),
  { fetchEnabledApps: user.fetchEnabledApps },
  null,
  { withRef: true }
)
class AppBar extends React.Component {
  static propTypes = {
    fetchEnabledApps: func
  };

  componentDidMount() {
    this.props.fetchEnabledApps();
  }

  veritoneAppDidAuthenticate = () => {
    this.props.fetchEnabledApps();
  };

  render() {
    return <LibAppBar {...this.props} />;
  }
}

export default widget(AppBar);
