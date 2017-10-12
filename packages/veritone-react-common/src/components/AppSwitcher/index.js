import React from 'react';
import Menu, { MenuItem } from 'material-ui/Menu';
import AppsIcon from 'material-ui-icons/Apps';
import IconButton from 'material-ui/IconButton';
import { string, arrayOf, shape, bool, func } from 'prop-types';

import AppSwitcherList from './AppSwitcherList';
import AppSwitcherErrorState from './AppSwitcherErrorState';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

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


  render() {
    // todo: loading state
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={this.openMenu}>
          <AppsIcon color="white"/>
        </IconButton>
        <Menu
          open={this.state.open}
          onRequestClose={this.closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          anchorEl={this.state.anchorEl}
          getContentAnchorEl={null}
        >
          {this.props.enabledAppsFailedLoading ? (
            <AppSwitcherErrorState handleRefresh={this.props.handleRefresh} />
          ) : (
            <AppSwitcherList enabledApps={this.props.enabledApps} />
          )}
        </Menu>
        <span className={styles['appSwitcher__title']}>
          {this.props.currentAppName}
        </span>
      </div>
    );
  }
}
