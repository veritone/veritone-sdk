import React from 'react';
import {
  string
} from 'prop-types';
import styles from './styles.scss';


export default class StatusPill extends React.Component {
  static propTypes = {
    status: string,
  };

  static defaultProps = {
    status: 'processing'
  };

  state = {
    status: this.props.status,
    statusPillStyle: {backgroundColor: '#2196F3', color: '#FFFFFF'}
  };  
  handleStatusPill = () => {
    let pill = this.state.status;
    if (pill === 'active') {
      this.state.statusPillStyle = {
        backgroundColor: '#00C853',
        color: '#FFFFFF'
      }
    } else if (pill === 'paused') {
      this.state.statusPillStyle = {
        backgroundColor: '#FFFFFF',
        border: '1px solid #607D8B',
        color: '#607D8B'
      }
    } else if (pill === 'processing') {
      this.state.statusPillStyle = {
        backgroundColor: '#2196F3',
        color: '#FFFFFF'
      }
    } else if (pill === 'inactive') {
      this.state.statusPillStyle = {
        backgroundColor: '#9E9E9E',
        color: '#FFFFFF'
      }
    }
  };

  componentWillMount() {
    if (this.props.status !== 'active' && this.props.status !== 'paused' && this.props.status !== 'processing' && this.props.status !== 'inactive') {
      this.state.status = 'processing';
    }
    this.handleStatusPill();
  };

  render() {
    return (
      <div className={styles.statusPill} style={this.state.statusPillStyle}>
        <div className={styles.statusPillText}>{this.state.status}</div>
      </div>
    )
  };

}