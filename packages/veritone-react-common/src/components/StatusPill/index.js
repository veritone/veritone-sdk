import React from 'react';
import { string } from 'prop-types';
import styles from './styles.scss';

export default class StatusPill extends React.Component {
  static propTypes = {
    status: string
  };

  static defaultProps = {
    status: 'processing'
  };

  state = {
    status: this.props.status,
    statusPillStyle: { backgroundColor: '#2196F3', color: '#FFFFFF' }
  };

  componentWillMount() {
    this.handleStatusPill();
  }

  handleStatusPill = () => {
    let status = this.state.status;
    if (
      this.props.status !== 'active' &&
      this.props.status !== 'paused' &&
      this.props.status !== 'processing' &&
      this.props.status !== 'inactive'
    ) {
      status = 'processing';
    }
    let statusPillStyle;
    if (status === 'active') {
      statusPillStyle = {
        backgroundColor: '#00C853',
        color: '#FFFFFF'
      };
    } else if (status === 'paused') {
      statusPillStyle = {
        backgroundColor: '#FFFFFF',
        border: '1px solid #607D8B',
        color: '#607D8B'
      };
    } else if (status === 'processing') {
      statusPillStyle = {
        backgroundColor: '#2196F3',
        color: '#FFFFFF'
      };
    } else if (status === 'inactive') {
      statusPillStyle = {
        backgroundColor: '#9E9E9E',
        color: '#FFFFFF'
      };
    }
    let newState = { status };
    if (statusPillStyle) {
      newState.statusPillStyle = statusPillStyle;
    }
    this.setState(newState);
  };

  render() {
    return (
      <div className={styles.statusPill} style={this.state.statusPillStyle}>
        <div className={styles.statusPillText}>{this.state.status}</div>
      </div>
    );
  }
}
