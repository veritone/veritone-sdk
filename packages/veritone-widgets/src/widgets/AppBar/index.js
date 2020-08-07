import React, { Fragment } from 'react';
import { func, string, bool } from 'prop-types';
import { connect } from 'react-redux';
import {
  AppBar as LibAppBar,
  appBarHeight,
  // eslint-disable-next-line import/named
  defaultAppBarZIndex
} from 'veritone-react-common';
import { modules } from 'veritone-redux-common';
const { user, config } = modules;

import widget from '../../shared/widget';
import UserProfile from '../UserProfile';

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
  { forwardRef: true }
)
class AppBar extends React.Component {
  static propTypes = {
    _widgetId: string,
    fetchEnabledApps: func,
    switchAppRoute: string.isRequired,
    isDiscovery: bool
  };

  state = {
    editingUserProfile: false
  };

  componentDidMount() {
    this.props.fetchEnabledApps();
  }

  veritoneAppDidAuthenticate = () => {
    this.props.fetchEnabledApps();
  };

  handleSwitchApp = id => {
    window.open(`${this.props.switchAppRoute}/${id}`);
  };

  handleEditProfile = () => {
    this.setState({
      editingUserProfile: true
    });
  };

  closeUserProfileEditor = () => {
    this.setState({
      editingUserProfile: false
    });
  };

  render() {
    return (
      <Fragment>
        <LibAppBar
          {...this.props}
          onSwitchApp={this.handleSwitchApp}
          onEditProfile={this.handleEditProfile}
        />

        <UserProfile
          open={this.state.editingUserProfile}
          onClose={this.closeUserProfileEditor}
        />
      </Fragment>
    );
  }
}

const AppBarWidget = widget(AppBar);
export { AppBar as default, AppBarWidget, defaultAppBarZIndex, appBarHeight };
