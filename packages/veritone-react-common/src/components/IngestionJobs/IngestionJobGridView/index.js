import React from 'react';

import {
  string,
  bool,
  func,
  arrayOf,
  number,
  objectOf,
  any
} from 'prop-types';

import IngestionJobGridCard from './IngestionJobGridCard';

import styles from './styles.scss';


export default class IngestionJobGridView extends React.Component {
  static propTypes = {
    jobInfo: arrayOf(objectOf(any)).isRequired
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false
  };

  render() {
    const jobs = this.props.jobInfo.map((job, index) => {
      return <div className={styles.gridCards} key={index}>
              <IngestionJobGridCard checkedAll={this.state.checkedAll} jobName={job.name} sourceType={job.sourceType} creationDate={job.creationDate} status={job.status} lastIngestion={job.lastIngested} thumbnail={job.thumbnail} key={index}/>
            </div>
    });
    return (
      <div className={styles.grid}>
        {jobs}
      </div>
    );
  };
}