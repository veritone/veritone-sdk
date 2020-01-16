import React from 'react';
import cx from 'classnames';
import { objectOf, any, func, shape } from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

class AppSwitcherItem extends React.Component {
  static propTypes = {
    app: objectOf(any).isRequired,
    onSelect: func.isRequired,
    classes: shape({any}),
  };

  handleSwitchApp = () => {
    this.props.onSelect(this.props.app.applicationId);
  };

  render() {
    const { app, classes } = this.props;

    const appListButtonIconClasses = cx(classes['appListButtonIcon'], {
      [`${classes['hasSvg']}`]: app.applicationIconSvg
    });

    return (
      <MenuItem
        button
        className={classes['appListButton']}
        // target={app.applicationId}
        onClick={this.handleSwitchApp}
      >
        <ListItemIcon>
          {app.signedApplicationIconUrl ||
          app.applicationIconUrl ||
          app.applicationIconSvg ? (
            <img
              className={appListButtonIconClasses}
              src={
                app.signedApplicationIconUrl ||
                app.applicationIconUrl ||
                app.applicationIconSvg
              }
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

export default withStyles(styles)(AppSwitcherItem);
