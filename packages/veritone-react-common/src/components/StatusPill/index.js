import React from 'react';
import {
  string
} from 'prop-types';
import styles from './styles.scss';

const stateStyles = {
  active: {
    backgroundColor: '#00C853',
    color: '#FFFFFF'
  },
  inactive: {
    backgroundColor: '#9E9E9E',
    color: '#FFFFFF'
  },
  paused: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #607D8B',
    color: '#607D8B'
  },
  processing: {
    backgroundColor: '#2196F3',
    color: '#FFFFFF'
  }
};

export default class StatusPill extends React.Component {
  static propTypes = {
    status: string,
  };

  static defaultProps = {
    status: 'processing'
  };

  render() {
    return (
      <div
        className={styles.statusPill}
        style={stateStyles[this.props.status || 'processing']}
      >
        <span className={styles.statusPillText}>
          {this.props.status}
        </span>
      </div>
    )
  };

}