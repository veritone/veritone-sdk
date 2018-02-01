import React from 'react';
import Menu from 'material-ui/es/Menu';
import AppsIcon from 'material-ui-icons/Apps';
import IconButton from 'material-ui/es/IconButton';
import { string, arrayOf, shape, bool, func } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import AppSwitcherList from './AppSwitcherList';
import AppSwitcherErrorState from './AppSwitcherErrorState';

import styles from './styles.scss';

@withMuiThemeProvider
export default class AppSwitcher extends React.Component {
  static propTypes = {
    className: string,
    currentAppName: string,
    enabledApps: arrayOf(
      shape({
        applicationId: string,
        applicationName: string,
        applicationIconSvg: string,
        applicationIconUrl: string
      })
    ),
    isFetchingApps: bool,
    enabledAppsFailedLoading: bool,
    handleRefresh: func
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
    window.location = `/switch-app/${id}`;
  };

  render() {
    // todo: loading state
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={this.openMenu}>
          <AppsIcon color="white" />
        </IconButton>
        <Menu
          open={this.state.open}
          onRequestClose={this.closeMenu}
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
