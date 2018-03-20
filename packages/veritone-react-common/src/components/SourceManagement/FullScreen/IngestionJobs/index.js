import React from 'react';

import {
  any
} from 'prop-types';

import JobTiles from 'components/IngestionJobs/IngestionJobTileView';

import styles from './styles.scss';

export default class IngestionJobsTab extends React.Component {
  static propTypes = {
    jobInfo: arrayOf(objectOf(any)).isRequired
  };

  static defaultProps = {};

  state = {

  };

  render() {
    return (
      <JobTiles jobInfo={this.props.jobInfo}/>
    );
  };
}