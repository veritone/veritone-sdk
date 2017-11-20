import React from 'react';
import { string, arrayOf, shape, func } from 'prop-types';
import { sortBy } from 'lodash';

import AppSwitcherItem from './AppSwitcherItem';
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
    ),
    onSwitchApp: func.isRequired
  };
  static defaultProps = {
    enabledApps: []
  };

  render() {
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
      <div className={styles['appListButtonNullstate']}>
        No Applications Found
      </div>
    );
  }
}
