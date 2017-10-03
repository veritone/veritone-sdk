import React from 'react';
import AppsIcon from 'material-ui/svg-icons/navigation/apps';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import { string, arrayOf, shape, bool, func } from 'prop-types';

import AppSwitcherList from './AppSwitcherList';
import AppSwitcherErrorState from './AppSwitcherErrorState';

import styles from './styles.scss';

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
    menuOpen: false
  };

  handleOnRequestChange = value => {
    this.setState({
      menuOpen: value
    });
  };

  render() {
    // todo: loading state
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconMenu
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          iconButtonElement={
            <IconButton
              style={{
                fontSize: 'inherit'
              }}
            >
              <AppsIcon color="white" />
            </IconButton>
          }
          open={this.state.menuOpen}
          onRequestChange={this.handleOnRequestChange}
        >
          {this.props.enabledAppsFailedLoading ? (
            <AppSwitcherErrorState handleRefresh={this.props.handleRefresh} />
          ) : (
            <AppSwitcherList enabledApps={this.props.enabledApps} />
          )}
        </IconMenu>
        <span className={styles['appSwitcher__title']}>
          {this.props.currentAppName}
        </span>
      </div>
    );
  }
}
