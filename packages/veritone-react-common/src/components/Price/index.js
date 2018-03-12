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
    symbol: '$',
    amount: 0
  };

  render() {
    const price = (this.props.amount / 100).toFixed(2);
    const units = String(price).split('.');
    return (
      <div className={styles.price}>
        <div className={styles.symbol}>{this.props.symbol}</div>
        <div className={styles.dollars}>{units[0]}</div>
        <div className={styles.cents}>{units[1]}</div>
        <div className={styles.text}>/media hour</div>
      </div>
    );
  }
}
