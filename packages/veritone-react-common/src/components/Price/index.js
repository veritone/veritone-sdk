import React from 'react';
import { string, number } from 'prop-types';

import styles from './styles.scss';

export default class Price extends React.Component {
  static propTypes = {
    symbol: string,
    text: string,
    amount: number
  };

  static defaultProps = {
    symbol: '$'
  }

  render() {
    return (
      <div className={styles.price}>
        <div className={styles.symbol}>{this.props.symbol}</div>
        <div className={styles.dollars}>1</div>
        <div className={styles.cents}>99</div>
        <div className={styles.text}>/media hour</div>
      </div>
    );
  }
}
