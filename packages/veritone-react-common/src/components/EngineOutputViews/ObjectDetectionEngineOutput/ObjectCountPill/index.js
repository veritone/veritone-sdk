import React, { Component } from 'react';
import { string, number, func } from 'prop-types';

import styles from './styles.scss';

class ObjectCountPill extends Component {
  static propTypes = {
    label: string,
    count: number,
    className: string,
    onClick: func
  }

  handleClick = (evt) => {
    this.props.onClick(this.props.label, evt);
  }

  render() {
    let { label, count } = this.props;
    return <div className={styles.objectPill} onClick={this.handleClick}>
      <span className={styles.objectLabel}>{label}</span>&nbsp;<a className={styles.objectCount}>({count})</a>
    </div>
  }
}

export default ObjectCountPill;