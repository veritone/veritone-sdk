import React from 'react';
import { storiesOf } from '@storybook/react';
import faker from 'faker';
import { flow, map, range, startCase, truncate, upperFirst } from 'lodash';
import { arrayOf, object } from 'prop-types';
import MuiTable, { TableBody, TableRow } from 'material-ui/Table';

import MenuColumn from './MenuColumn';
import { Table, Column, PaginatedTable } from './';

const row = () => ({
  date: faker.date.future(),
  name: faker.internet.userName(),
  text: faker.lorem.paragraph(),
  ip: faker.internet.ip()
});
const data = range(50).map(row);

const columns = map(data[0], (val, key) => {
  return {
    dataKey: key,
    header: startCase(key),
    cellRenderer: flow([upperFirst, truncate]),
    align: 'center',
    width: Math.min((Math.min(key.length, 4) + 1) * 10, 100)
  };
});

class BasicTable extends React.Component {
  static propTypes = {
    data: arrayOf(object)
  };

  getRowData = i => this.props.data[i];

  handleCellClick(row, columnKey) {
    console.log(`row: ${row}`, `columnKey: ${columnKey}`);
  }

  render() {
    return (
      <Table
        rowGetter={this.getRowData}
        rowCount={data.length}
        showHeader
        onCellClick={this.handleCellClick}
      >
        {columns.map(c => <Column key={c.dataKey} {...c} />)}
      </Table>
    );
  }
}

class BasicSplitTable extends React.Component {
  static propTypes = {
    data: arrayOf(object)
  };

  state = {
    focusedTableRow: null
  };

  getRowData = i => {
    return data[i];
  };

  renderFocusedRowDetails = row => {
    return (
      <div style={{ textAlign: 'center' }}>
        {row.name} - {this.state.focusedTableRow + 1}
      </div>
    );
  };

  setFocusedRow = (row, columnKey) => {
    this.setState({ focusedTableRow: row });
  };

  render() {
    return (
      <Table
        rowGetter={this.getRowData}
        rowCount={data.length}
        showHeader
        onCellClick={this.setFocusedRow}
        focusedRow={this.state.focusedTableRow}
        renderFocusedRowDetails={this.renderFocusedRowDetails}
      >
        {columns.map(c => <Column key={c.dataKey} {...c} />)}
      </Table>
    );
  }
}

class PagedTable extends React.Component {
  static propTypes = {
    data: arrayOf(object)
  };

  getRowData = i => {
    return this.props.data[i];
  };

  handleRefreshPageData = () => {
    console.log('Refresh Me');
  };

  handleCellClick = (row, columnKey) => {
    console.log(`row: ${row}`, `columnKey: ${columnKey}`);
  };

  render() {
    const tableEmptyMessage =
      'Nothing to see here!';

    const tableEmptyFailureMessage =
      'Data failed to load; please try again later.';

    return (
      <PaginatedTable
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
        initialItemsPerPage={5}
        showHeader
        onRefreshPageData={this.handleRefreshPageData}
        onCellClick={this.handleCellClick}
        emptyMessage={tableEmptyMessage}
        emptyFailureMessage={tableEmptyFailureMessage}
      >
        {columns.map(c => <Column key={c.dataKey} {...c} />)}
      </PaginatedTable>
    );
  }
}

class SplitTable extends React.Component {
  static propTypes = {
    data: arrayOf(object)
  };

  state = {
    focusedTableRow: null
  };

  getRowData = i => {
    return this.props.data[i];
  };

  renderFocusedRowDetails = row => {
    return (
      <div style={{ textAlign: 'center' }}>
        {row.name} - {this.state.focusedTableRow + 1}
      </div>
    );
  };

  setFocusedRow = (row, columnKey) => {
    this.setState({ focusedTableRow: row });
  };

  handleRefreshPageData = () => {
    return console.log('Refresh Me');
  };

  render() {
    const tableEmptyMessage =
      'Nothing to see here!';

    const tableEmptyFailureMessage =
      'Data failed to load; please try again later.';

    return (
      <PaginatedTable
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
        initialItemsPerPage={5}
        showHeader
        onRefreshPageData={this.handleRefreshPageData}
        onCellClick={this.setFocusedRow}
        focusedRow={this.state.focusedTableRow}
        renderFocusedRowDetails={this.renderFocusedRowDetails}
        emptyMessage={tableEmptyMessage}
        emptyFailureMessage={tableEmptyFailureMessage}
      >
        {columns.map(c => <Column key={c.dataKey} {...c} />)}
      </PaginatedTable>
    );
  }
}

storiesOf('Table', module)
  .add('Basic Table', () => <BasicTable data={data} />)
  .add('Basic Split Table', () => <BasicSplitTable data={data} />)
  .add('Paginated Table', () => <PagedTable data={data} />)
  .add('Paginated Split Table', () => <SplitTable data={data} />)
  .add('Menu Column', () => {
    const data = {
      actions: ['submit', 'delete']
    };

    return (
      <MuiTable>
        <TableBody>
          <TableRow>
            <MenuColumn
              align="left"
              data={data}
              dataKey="actions"
              protectedActions={['delete']}
            />
          </TableRow>
        </TableBody>
      </MuiTable>
    );
  });
