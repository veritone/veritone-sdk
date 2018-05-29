import React from 'react';
import { arrayOf, object, func, bool } from 'prop-types';
import {
  IngestionJobNullstate,
  IngestionJobTileView
} from 'veritone-react-common';
import { omit } from 'lodash';

import widget from '../../shared/widget';

class IngestionJobListWidget extends React.Component {
  static propTypes = {
    jobs: arrayOf(object).isRequired,
    onCreateJob: func.isRequired,
    onSelectJob: func,
    onSelectMenuItem: func,
    paginate: bool,
    fetchData: func
  };

  constructor(props) {
    super(props);
    this.state = {
      jobs: props.jobs
    }
  }

  handleFetchData = ({ start, end }) => {
    if (this.props.fetchData && !this.state.jobs[end + 1]) {
      this.props.fetchData(end - start + 1, end + 1);
    }
  }

  updateJobs = (jobs) => {
    this.setState({
      jobs
    })
  }

  render() {
    const viewProps = omit(this.props, ['onCreateJob', 'jobs', 'fetchData']);

    return !this.state.jobs.length ? (
      <IngestionJobNullstate onClick={this.props.onCreateJob} />
    ) : (
      <IngestionJobTileView
        {...viewProps}
        jobs={this.state.jobs}
        onFetchData={this.handleFetchData}
      />
    );
  }
}

export default widget(IngestionJobListWidget);
