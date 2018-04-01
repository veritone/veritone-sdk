import React from 'react';

import {
  arrayOf,
  any,
  objectOf
} from 'prop-types';

import {
  Checkbox,
} from 'components/formComponents';

import JobRow from './JobRow';

import styles from './styles.scss';

export default class IngestionJobTileView extends React.Component {
  static propTypes = {
    jobInfo: arrayOf(objectOf(any)).isRequired
  };

  static defaultProps = {};

  state = {
    checkedAll: false,
  };

  handleCheckboxChange = () => {
    this.setState({
      checkedAll: !this.state.checkedAll
    });
  };

  render() {
    const jobRows = this.props.jobInfo.map((row, index) => {
      return <JobRow 
          checkAll={this.state.checkedAll} 
          name={row.name} 
          status={row.status}
          adapter={row.adapter}
          ingestionType={row.ingestionType}
          creationDate={row.creationDate}
          lastIngested={row.lastIngested}
          key={index} />
    });
    return (
      <div>
        <div className={styles.tableTitleRow}>
          <Checkbox
            input={{
              onChange: this.handleCheckboxChange,
              value: this.state.checkedAll
            }}
            className={styles.checkbox}
            label=''
          />
          <div className={styles.titleTextGroup}>
            <span className={styles.tableTitle}>Job name</span>
            <span className={styles.tableTitle}>Status</span>
            <span className={styles.tableTitle}>Adapter</span>
            <span className={styles.tableTitle}>Ingestion Type</span>
            <span className={styles.tableTitle}>Creation Date</span>
            <span className={styles.tableTitle}>Last Ingestion</span>
          </div>
          <div style={{width: '55px'}} />
        </div>
        {jobRows}
      </div>
    );
  };
}