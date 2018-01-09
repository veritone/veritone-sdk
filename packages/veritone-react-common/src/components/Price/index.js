import React from 'react';
import { string, node } from 'prop-types';

import styles from './styles.scss';

export default class Price extends React.Component {
  static propTypes = {
    // symbol: propTypes.string.isRequired,
  };

  render() {
    // const { } = this.props;
    return (
      <div className={styles.price}>
        <div className={styles.symbol}>$</div>
        <div className={styles.dollars}>1</div>
        <div className={styles.cents}>99</div>
        <div className={styles.text}>/media hour</div>
      </div>
    );
  }
}