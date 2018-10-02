import React from 'react';

import { arrayOf, any, objectOf, bool, func } from 'prop-types';

import { Table, PaginatedTable, Column } from 'components/DataTable';
import MenuColumn from 'components/DataTable/MenuColumn';
import StatusPill from 'components/StatusPill';
import { format } from 'date-fns';
import { map, uniq, omit, noop } from 'lodash';
import classNames from 'classnames';

import Tooltip from '@material-ui/core/Tooltip';
import SharedIcon from '@material-ui/icons/People';

import styles from './styles.scss';

export default class IngestionJobTileView extends React.Component {
  static propTypes = {
    jobs: arrayOf(objectOf(any)).isRequired, // an array of source objects
    onSelectJob: func,
    onSelectMenuItem: func,
    paginate: bool,
    onFetchData: func
  };

  static defaultProps = {
    onSelectJob: noop,
    onSelectMenuItem: noop,
    onFetchData: noop
  };

  getIngestionJobData = i => {
    return this.props.jobs[i];
  };

  renderNameCell = (name, data) => {
    const cellContents = [name];

    if (data.permission === 'viewer') {
      cellContents.push(
        <span key={data.id + 'space2'} className={classNames(styles.gap)} />
      );
      cellContents.push(
        <Tooltip
          title="Shared with You"
          placement="right"
          key={data.id + 'share'}
        >
          <SharedIcon className={styles.sharedIcon} />
        </Tooltip>
      );
    }

    return (
      <span className={classNames(styles.ingestionTileViewCell)}>
        {cellContents}
      </span>
    );
  };

  renderEnginesIcons = taskTemplates => {
    const icons = uniq(map(taskTemplates, 'engine.category.iconClass'));

    return (
      <span className={styles.engineIcons}>
        {icons.length ? (
          icons.map(
            icon => (icon ? <span key={icon} className={icon} /> : undefined)
          )
        ) : (
          <span>{'-'}</span>
        )}
      </span>
    );
  };

  renderAdapter = ingestionJobEngine => {
    return ingestionJobEngine ? ingestionJobEngine.name : '-';
  };

  renderLastIngestion = mostRecentJob => {
    return mostRecentJob
      ? format(mostRecentJob.createdDateTime, 'M/D/YYYY h:mm A')
      : '-';
  };

  renderStatus = isActive => {
    return <StatusPill status={isActive ? 'active' : 'inactive'} />;
  };

  transformActions = (actions, data) => {
    if (data && data.permission === 'viewer') {
      return ['View', 'Remove'];
    }
    return actions;
  };

  render() {
    const TableComp = this.props.paginate ? PaginatedTable : Table;
    const tableProps = omit(this.props, ['jobs', 'paginate', 'onFetchData']);
    const ingestionJobKey = 'ingestionTask.engine';

    if (this.props.paginate) {
      tableProps.onShowCellRange = this.props.onFetchData;
    }

    return (
      <TableComp
        rowGetter={this.getIngestionJobData}
        rowCount={this.props.jobs.length}
        onCellClick={this.props.onSelectJob}
        rowHeight={48}
        {...tableProps}
      >
        <Column
          header="Job Name"
          dataKey="name"
          cellRenderer={this.renderNameCell}
        />
        <Column
          dataKey="isActive"
          header="Status"
          cellRenderer={this.renderStatus}
        />
        <Column
          dataKey="completeTasks"
          header="Engines"
          cellRenderer={this.renderEnginesIcons}
          align="center"
        />
        <Column
          dataKey={ingestionJobKey}
          header="Adapter"
          cellRenderer={this.renderAdapter}
        />
        <Column
          dataKey="jobs.records[0]"
          header="Last Ingestion"
          cellRenderer={this.renderLastIngestion}
        />
        <MenuColumn
          id="menu"
          actions={['Edit', 'Delete']}
          protectedActions={['Delete']}
          onSelectItem={this.props.onSelectMenuItem}
          transformActions={this.transformActions}
        />
      </TableComp>
    );
  }
}
