import React from 'react';
import { string, arrayOf, shape, func, any } from 'prop-types';
import { sortBy } from 'lodash';
import { withStyles } from '@material-ui/styles';

import AppSwitcherItem from './AppSwitcherItem';
import styles from './styles';

class AppSwitcherList extends React.Component {
  static propTypes = {
    enabledApps: arrayOf(
      shape({
        applicationId: string,
        applicationName: string,
        applicationIconSvg: string,
        applicationIconUrl: string
      })
    ),
    onSwitchApp: func.isRequired,
    classes: shape({any})
  };
  static defaultProps = {
    enabledApps: []
  };

  render() {
    const { classes } = this.props;
    const apps = sortBy(this.props.enabledApps, 'applicationName');
    return apps.length ? (
      <div>
        {apps.map(app => (
          <AppSwitcherItem
            app={app}
            onSelect={this.props.onSwitchApp}
            key={app.applicationId}
          />
        ))}
      </div>
    ) : (
      <div className={classes['appListButtonNullstate']}>
        No Applications Found
      </div>
    );
  }
}

export default withStyles(styles)(AppSwitcherList);
