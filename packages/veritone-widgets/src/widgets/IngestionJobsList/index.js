import React from 'react';
import { arrayOf, object, func, bool } from 'prop-types';
import { IngestionJobs } from 'veritone-react-common';
import { omit } from 'lodash';

import widget from '../../shared/widget';

const { NullState, ListView } = IngestionJobs;

class IngestionJobListWidget extends React.Component {
  static propTypes = {
    jobs: arrayOf(object).isRequired,
    onCreateJob: func.isRequired,
    onSelectJob: func,
    onSelectMenuItem: func,
    paginate: bool,
    fetchData: func
  };

  state = {
    jobs: this.props.jobs
  };

  handleFetchData = ({ start, end }) => {
    const perPage = end - start + 1;
    const jobsCount = this.state.jobs.length;

    if (
      this.props.fetchData &&
      (!this.state.jobs[end + 1] || jobsCount - perPage < perPage)
    ) {
      const limit = !(jobsCount % perPage) ? perPage : jobsCount % perPage;

      this.props.fetchData(limit, jobsCount);
    }
  };

  updateJobs = jobs => {
    this.setState({
      jobs
    });
  };

  render() {
    const viewProps = omit(this.props, ['onCreateJob', 'jobs', 'fetchData']);

    return !this.state.jobs.length ? (
      <NullState onClick={this.props.onCreateJob} />
    ) : (
      <ListView
        {...viewProps}
        jobs={this.state.jobs}
        onFetchData={this.handleFetchData}
      />
    );
  }
}

export default widget(IngestionJobListWidget);
