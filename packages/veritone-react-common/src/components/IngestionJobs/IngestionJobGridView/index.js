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
              <IngestionJobGridCard checkedAll={this.state.checkedAll} jobName={job.name} status={job.status} creationDate={job.creationDate} thumbnail={job.thumbnail} key={index}/>
            </div>
    });
    return (
      <div className={styles.sourcesGrid}>
        {jobs}
      </div>
    );
  };
}