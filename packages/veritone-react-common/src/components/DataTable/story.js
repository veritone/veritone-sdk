import React from 'react';
import { storiesOf } from '@storybook/react';
import faker from 'faker';
import { flow, map, range, startCase, truncate, upperFirst } from 'lodash';
import { arrayOf, object, func } from 'prop-types';
import MuiTable from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

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
    width: key === 'ip' ? 300 : undefined
  };
});

class BasicTable extends React.Component {
  static propTypes = {
    data: arrayOf(object),
    onCellClick: func
  };

  getRowData = i => this.props.data[i];

  render() {
    return (
      <Table
        rowGetter={this.getRowData}
        rowCount={data.length}
        showHeader
        onCellClick={this.props.onCellClick}
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
    data: arrayOf(object),
    onCellClick: func
  };

  getRowData = i => {
    return this.props.data[i];
  };

  handleRefreshPageData = () => {
    console.log('Refresh Me');
  };

  render() {
    const tableEmptyMessage = 'Nothing to see here!';

    const tableEmptyFailureMessage =
      'Data failed to load; please try again later.';

    return (
      <PaginatedTable
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
        initialItemsPerPage={5}
        showHeader
        onRefreshPageData={this.handleRefreshPageData}
        onCellClick={this.props.onCellClick}
        emptyMessage={tableEmptyMessage}
        emptyFailureMessage={tableEmptyFailureMessage}
      >
        {columns.map(c => <Column key={c.dataKey} {...c} />)}
      </PaginatedTable>
    );
  }
}

class PagedSplitTable extends React.Component {
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
    const tableEmptyMessage = 'Nothing to see here!';

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

class HeadlessTable extends React.Component {
  static propTypes = {
    data: arrayOf(object),
    onCellClick: func
  };

  getRowData = i => this.props.data[i];

  render() {
    return (
      <Table
        rowGetter={this.getRowData}
        rowCount={data.length}
        showHeader={false}
        onCellClick={this.props.onCellClick}
      >
        {columns.map(c => <Column key={c.dataKey} {...c} />)}
      </Table>
    );
  }
}

class TableWithStaticMenuColumn extends React.Component {
  static propTypes = {
    data: arrayOf(object),
    onCellClick: func
  };

  getRowData = i => this.props.data[i];

  handleSelectItem(action, event) {
    console.log('action, event:', action, event);
  }

  render() {
    return (
      <Table
        rowGetter={this.getRowData}
        rowCount={data.length}
        showHeader={false}
        onCellClick={this.props.onCellClick}
      >
        {columns.map(c => <Column key={c.dataKey} {...c} />)}
        <MenuColumn
          actions={['View', 'Edit', 'Delete']}
          onSelectItem={this.handleSelectItem}
          protectedActions={['Delete']}
        />
      </Table>
    );
  }
}

function handleCellClick(row, columnKey, event) {
  console.log(`row: ${row}`, `columnKey: ${columnKey}`, event.currentTarget);
}

storiesOf('Table', module)
  .add('Basic Table', () => (
    <BasicTable data={data} onCellClick={handleCellClick} />
  ))
  .add('Basic Split Table', () => <BasicSplitTable data={data} />)
  .add('Paginated Table', () => (
    <PagedTable data={data} onCellClick={handleCellClick} />
  ))
  .add('Paginated Split Table', () => <PagedSplitTable data={data} />)
  .add('Table w/o Heading', () => (
    <HeadlessTable data={data} onCellClick={handleCellClick} />
  ))
  .add('Menu Column', () => {
    const data = {
      title: 'Some title',
      description: 'Lorem ipsum...',
      actions: ['submit', 'delete', 'alter']
    };

    function handleSelectItem(action, data, event) {
      console.log('action, data:', action, data, event);
    }

    return (
      <MuiTable>
        <TableBody>
          <TableRow>
            <MenuColumn
              align="left"
              data={data}
              dataKey="actions"
              protectedActions={['delete']}
              excludeActions={['alter']}
              onSelectItem={handleSelectItem}
            />
          </TableRow>
        </TableBody>
      </MuiTable>
    );
  })
  .add('Table With Static Menu Column', () => (
    <TableWithStaticMenuColumn data={data} onCellClick={handleCellClick} />
  ));
