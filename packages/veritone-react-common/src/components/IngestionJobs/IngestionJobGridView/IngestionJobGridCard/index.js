import React from 'react';

import { string, bool } from 'prop-types';
import { Checkbox } from 'components/formComponents';

import StatusPill from 'components/StatusPill';

import styles from './styles.scss';

export default class IngestionJobGridCard extends React.Component {
  static propTypes = {
    checkedAll: bool.isRequired,
    jobName: string.isRequired,
    sourceType: string.isRequired,
    status: string.isRequired,
    creationDate: string.isRequired,
    lastIngestion: string.isRequired,
    thumbnail: string
  };

  static defaultProps = {};

  state = {
    checked: this.props.checkedAll || false,
    statusPillStyle: { backgroundColor: '#2196F3', color: '#FFFFFF' }
  };

  componentWillMount() {
    this.handleStatusPill();
  }

  handleCheckboxChange = () => {
    this.setState({
      checked: !this.state.checked
    });
  };

  handleStatusPill = () => {
    let pill = this.props.status;
    let statusPillStyle;
    if (pill === 'active') {
      statusPillStyle = {
        backgroundColor: '#00C853',
        color: '#FFFFFF'
      };
    } else if (pill === 'paused') {
      statusPillStyle = {
        backgroundColor: '#FFFFFF',
        border: '1px solid #607D8B',
        color: '#607D8B'
      };
    } else if (pill === 'processing') {
      statusPillStyle = {
        backgroundColor: '#2196F3',
        color: '#FFFFFF'
      };
    } else if (pill === 'inactive') {
      statusPillStyle = {
        backgroundColor: '#9E9E9E',
        color: '#FFFFFF'
      };
    }
    if (statusPillStyle) {
      this.setState({ statusPillStyle });
    }
  };

  render() {
    return (
      <div className={styles.card}>
        <div className={styles.thumbnail}>
          <img
            className={styles.imageStyle}
            src={this.props.thumbnail}
            alt="https://static.veritone.com/veritone-ui/default-nullstate.svg"
          />
        </div>
        <div className={styles.details}>
          {/* BELOW IS A HACK FOR GETTING CHECKBOX BACKGROUND TO BE WHITE */}
          <div className={styles.checkboxBackground} />
          <Checkbox
            input={{
              onChange: this.handleCheckboxChange,
              value: this.state.checked
            }}
            className={styles.checkbox}
            color="primary"
            classes={{
              checked: styles.checkboxPrimary
            }}
            label=""
          />
          <div className={styles.name}>{this.props.jobName}</div>
          <div className={styles.gridDetails}>
            <div className={styles.gridDetailsRow}>
              <div className={styles.detailsTitle}>Source Type: </div>
              <div className={styles.detailsText}>{this.props.sourceType}</div>
            </div>
            <div className={styles.gridDetailsRow}>
              <div className={styles.detailsTitle}>Created:</div>
              <div className={styles.detailsText}>
                {this.props.creationDate}
              </div>
            </div>
            <div className={styles.gridDetailsRow}>
              <div className={styles.detailsTitle}>Last Ingestion:</div>
              <div className={styles.detailsText}>
                {this.props.lastIngestion}
              </div>
            </div>
          </div>
          <div className={styles.status}>
            <StatusPill status={this.props.status} />
          </div>
        </div>
      </div>
    );
  }
}
