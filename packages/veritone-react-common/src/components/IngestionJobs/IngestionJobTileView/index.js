import React, { Fragment } from 'react';

import { arrayOf, any, objectOf } from 'prop-types';

import { Table, Column } from 'components/DataTable';
// import MenuColumn from 'components/DataTable/MenuColumn';
import StatusPill from 'components/StatusPill';
import { format } from 'date-fns';
import { map, find, get } from 'lodash';

export default class SourceTileView extends React.Component {
  static propTypes = {
    jobs: arrayOf(objectOf(any)).isRequired // an array of source objects
    // onSelectJob: func.isRequired,
  };

  static defaultProps = {};

  getIngestionJobData = i => {
    return this.props.jobs[i];
  };

  renderEnginesIcons = taskTemplates => {
    const icons = map(taskTemplates.records, 'engine.category.iconClass');

    return (
      <Fragment>
        {icons.map(icon => {
          return icon ? <span key={icon} className={icon} /> : undefined;
        })}
      </Fragment>
    );
  };

  renderAdapter = taskTemplates => {
    const ingestionTaskTemplate = getIngestionTaskTemplate(taskTemplates);

    return ingestionTaskTemplate ? ingestionTaskTemplate.engine.name : '-';
  };

  renderIngestionType = taskTemplates => {
    const ingestionTaskTemplate = getIngestionTaskTemplate(taskTemplates);

    return ingestionTaskTemplate
      ? ingestionTaskTemplate.engine.category.name
      : '-';
  };

  renderLastIngestion = mostRecentJob => {
    return format(mostRecentJob.createdDateTime, 'M/D/YYYY h:mm A');
  };

  renderStatus = isActive => {
    return <StatusPill status={isActive ? 'active' : 'inactive'} />;
  };

  render() {
    return (
      <Table
        rowGetter={this.getIngestionJobData}
        rowCount={this.props.jobs.length}
        rowHeight={48}
      >
        <Column dataKey="name" header="Job Name" />
        <Column
          dataKey="isActive"
          header="Status"
          cellRenderer={this.renderStatus}
        />
        <Column
          dataKey="jobTemplates.records[0].taskTemplates"
          header="Engines"
          cellRenderer={this.renderEnginesIcons}
          align="center"
        />
        <Column
          dataKey="jobTemplates.records[0].taskTemplates"
          header="Adapter"
          cellRenderer={this.renderAdapter}
        />
        <Column
          dataKey="jobTemplates.records[0].taskTemplates"
          header="Ingestion Type"
          cellRenderer={this.renderIngestionType}
          align="center"
        />
        <Column
          dataKey="jobs.records[0]"
          header="Last Ingestion"
          cellRenderer={this.renderLastIngestion}
        />
        {/* <MenuColumn
          id="menu"
          dataKey='jobTemplates.records[0].taskTemplates'
          onSelectItem={this.props.onSelectMenuItem}
        /> */}
      </Table>
    );
  }
}

function getIngestionTaskTemplate(taskTemplates) {
  return find(
    taskTemplates.records,
    templateRecord =>
      get(templateRecord, 'engine.category.type.name') === 'Ingestion'
  );
}
