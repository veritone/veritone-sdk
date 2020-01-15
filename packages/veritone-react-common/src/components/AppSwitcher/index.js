import React from 'react';
import Menu from '@material-ui/core/Menu';
import AppsIcon from '@material-ui/icons/Apps';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';
import { string, arrayOf, shape, bool, func, any } from 'prop-types';

import AppSwitcherList from './AppSwitcherList';
import AppSwitcherErrorState from './AppSwitcherErrorState';

import styles from './styles';

class AppSwitcher extends React.Component {
  static propTypes = {
    tooltipTitle: string,
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
    onSwitchApp: func,
    classes: shape({any}),
  };
  static defaultProps = {
    tooltipTitle: 'Switch Apps'
  };

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
    const { classes } = this.props;
    // todo: loading state
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title={this.props.tooltipTitle || ''} disableFocusListener>
          <IconButton
            onClick={this.openMenu}
            data-veritone-element="app-switcher-button"
          >
            <AppsIcon htmlColor="white" />
          </IconButton>
        </Tooltip>
        <Menu
          open={this.state.open}
          onClose={this.closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          anchorEl={this.state.anchorEl}
          getContentAnchorEl={null}
          className={classes.popover}
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
        <span className={classes.appSwitcherTitle}>
          {this.props.currentAppName}
        </span>
      </div>
    );
  }
}

export default withStyles(styles)(AppSwitcher);
