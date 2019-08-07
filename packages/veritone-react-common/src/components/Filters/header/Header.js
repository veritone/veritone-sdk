import React from 'react';
import { element } from 'prop-types';
import styles from './styles.scss';

export default class FiltersHeader extends React.Component {
  static propTypes = {
    rightIconButtonElement: element
  };

  render() {
    return (
      <div className={styles.container}>
        {
          <div className={styles.singleTabContainer}>
            <div className={styles.tabLabel}>Filters</div>
          </div>
        }
        <div className={styles.rightIconButtonContainer}>
          {this.props.rightIconButtonElement}
        </div>
      </div>
    );
  }
}
