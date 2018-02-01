import React from 'react';
import cx from 'classnames';
import { objectOf, any, func } from 'prop-types';
import { MenuItem } from 'material-ui/es/Menu';
import { ListItemIcon, ListItemText } from 'material-ui/es/List';

import styles from './styles.scss';

export default class AppSwitcherItem extends React.Component {
  static propTypes = {
    app: objectOf(any).isRequired,
    onSelect: func.isRequired
  };

  handleSwitchApp = () => {
    this.props.onSelect(this.props.app.applicationId);
  };

  render() {
    const { app } = this.props;

    const appListButtonIconClasses = cx(styles['appListButtonIcon'], {
      [`${styles['hasSvg']}`]: app.applicationIconSvg
    });

    return (
      <MenuItem
        button
        className={styles['appListButton']}
        // target={app.applicationId}
        onClick={this.handleSwitchApp}
      >
        <ListItemIcon>
          {app.applicationIconUrl || app.applicationIconSvg ? (
            <img
              className={appListButtonIconClasses}
              src={app.applicationIconUrl || app.applicationIconSvg}
            />
          ) : (
            <span
              className={cx(appListButtonIconClasses, 'icon-applications')}
            />
          )}
        </ListItemIcon>
        <ListItemText primary={app.applicationName} />
      </MenuItem>
    );
  }
}
