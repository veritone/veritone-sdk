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
    jobData: arrayOf(objectOf(any)).isRequired
  };

  static defaultProps = {

  };

  state = {
    checkedAll: false
  };

  render() {
    const jobs = this.props.jobData.map((job, index) => {
      return <div className={styles.gridCards} key={index}><IngestionJobGridCard checkedAll={this.state.checkedAll} sourceName={job.sourceName} schemaVersion={job.schemaVersion} creationDate={job.creationDate} thumbnail={job.thumbnail} key={index}/></div>
    });
    return (
      <div className={styles.sourcesGrid}>
        {jobs}
      </div>
    );
  };
}