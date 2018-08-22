import React from 'react';
import Menu from '@material-ui/core/Menu';
import AppsIcon from '@material-ui/icons/Apps';
import IconButton from '@material-ui/core/IconButton';
import { string, arrayOf, shape, bool, func } from 'prop-types';

import AppSwitcherList from './AppSwitcherList';
import AppSwitcherErrorState from './AppSwitcherErrorState';

import styles from './styles.scss';

export default class AppSwitcher extends React.Component {
  static propTypes = {
    currentAppName: string,
    enabledApps: arrayOf(
      shape({
        applicationId: string,
        applicationName: string,
        applicationIconSvg: string,
        applicationIconUrl: string,
        signedApplicationIconUrl: string
      })
    ),
    enabledAppsFailedLoading: bool,
    handleRefresh: func,
    onSwitchApp: func
  };
  static defaultProps = {};

  state = {
    open: false,
    anchorEl: null
  };

  openMenu = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({
      open: false
    });
  };

  handleSwitchApp = id => {
    this.props.onSwitchApp(id);
  };

  render() {
    // todo: loading state
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={this.openMenu}>
          <AppsIcon nativeColor="white" />
        </IconButton>
        <Menu
          open={this.state.open}
          onClose={this.closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          anchorEl={this.state.anchorEl}
          getContentAnchorEl={null}
        >
          {this.props.enabledAppsFailedLoading ? (
            <AppSwitcherErrorState onRefresh={this.props.handleRefresh} />
          ) : (
            <AppSwitcherList
              onSwitchApp={this.handleSwitchApp}
              enabledApps={this.props.enabledApps}
            />
          )}
        </Menu>
        <span className={styles['appSwitcher__title']}>
          {this.props.currentAppName}
        </span>
      </div>
    );
  }
}
