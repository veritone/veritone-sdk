import React from 'react';
import { string } from 'prop-types';
import styles from './styles.scss';

export default class NavigationSideBarHeader extends React.Component {
  static propTypes = {
    title: string.isRequired
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.singleTabContainer}>
          <div className={styles.singleTabLabel}>{this.props.title}</div>
        </div>
      </div>
    );
  }
}
