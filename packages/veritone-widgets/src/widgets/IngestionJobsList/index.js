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
    paginate: bool
  };

  render() {
    const viewProps = omit(this.props, ['onCreateJob']);

    return !this.props.jobs.length ? (
      <IngestionJobNullstate onClick={this.props.onCreateJob} />
    ) : (
      <IngestionJobTileView {...viewProps} />
    );
  }
}

export default widget(IngestionJobListWidget);
