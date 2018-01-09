import React from 'react';
import { string, node } from 'prop-types';

import styles from './styles.scss';

export default class Tabs extends React.Component {
  static propTypes = {
  };

  render() {
    // const { } = this.props;
    return (
      <div className={styles.tabs}>
        <div className={styles.tab}>
          <div>
            Your Engines <span>(0)</span>
          </div>
        </div>
        <div className={styles.tab}>
          <div>
            Explore All Engines
          </div>
        </div>
      </div>
    );
  }
}