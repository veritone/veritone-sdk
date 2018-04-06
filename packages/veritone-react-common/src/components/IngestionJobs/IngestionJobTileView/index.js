import React from 'react';

import {
  arrayOf,
  any,
  objectOf,
  func
} from 'prop-types';

import { Table, Column } from 'components/DataTable';
import StatusPill from 'components/StatusPill';
import { format } from 'date-fns';

export default class SourceTileView extends React.Component {
  static propTypes = {
    jobs: arrayOf(objectOf(any)).isRequired, // an array of source objects
    onSelectJob: func.isRequired,
    onSelectMenuItem: func
  };

  static defaultProps = {
    jobs: []
  };

  getIngestionJobData = (i) => {
    return this.props.jobs[i];
  }

  renderLastIngestion = (date) => {
    return format(date, 'M/D/YYYY h:mm A');
  }

  renderStatus = (isActive) => {
    return <StatusPill status={isActive ? 'active' : 'inactive'} />;
  }

  render() {
    return (
      <Table
        rowGetter={this.getIngestionJobData}
        rowCount={this.props.jobs.length}
        rowHeight={48}
      >
        <Column
          dataKey='name'
          header='Job Name'
        />
        <Column
          dataKey='isActive'
          header='Status'
          cellRenderer={this.renderStatus}
        />
        <Column
          dataKey='engines'
          header='Engines'
          cellRenderer={this.renderLastIngestion}
        />
        <Column
          dataKey='adapter'
          header='Adapter'
          cellRenderer={this.renderUpdatedDate}
        />
        <Column
          dataKey='ingestionType'
          header='Ingestion Type'
          cellRenderer={this.renderUpdatedDate}
        />
        <Column
          dataKey='modifiedDateTime'
          header='Last Ingestion'
          cellRenderer={this.renderLastIngestion}
        />
        {/* <MenuColumn
          id="menu"
          dataKey=''
          onSelectItem={this.props.onSelectMenuItem}
        /> */}
      </Table>
    );
  };
}