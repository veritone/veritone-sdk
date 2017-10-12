import React from 'react';
import {MenuItem} from 'material-ui/Menu';
import {
  ListItemIcon,
  ListItemText
} from 'material-ui/List';
import { string, arrayOf, shape }  from 'prop-types';
import { sortBy } from 'lodash';
import cx from 'classnames';

import styles from './styles.scss';

export default class AppSwitcherList extends React.Component {
  static propTypes = {
    enabledApps: arrayOf(
      shape({
        applicationId: string,
        applicationName: string,
        applicationIconSvg: string,
        applicationIconUrl: string
      })
    )
  };
  static defaultProps = {
    enabledApps: []
  };

  render() {
    const apps = sortBy(this.props.enabledApps, 'applicationName');
    return apps.length
      ? <div>
        {apps.map(app => {
          const appListButtonIconClasses = cx(styles['appListButtonIcon'], {
            [`${styles['hasSvg']}`]: app.applicationIconSvg
          });

          return (
            <MenuItem
              button
              className={styles['appListButton']}
              key={app.applicationId}
              href={`/switch-app/${app.applicationId}`}
              target={app.applicationId}
            >
              <ListItemIcon>
              {app.applicationIconUrl || app.applicationIconSvg
                ? <img
                  className={appListButtonIconClasses}
                  src={app.applicationIconUrl || app.applicationIconSvg}
                />
                : <span
                  className={cx(
                    appListButtonIconClasses,
                    'icon-applications'
                  )}
                />}
              </ListItemIcon>
              <ListItemText primary={app.applicationName} />

            </MenuItem>
          );
        })}
      </div>
      : <div className={styles['appListButtonNullstate']}>
        No Applications Found
      </div>;
  }
}
