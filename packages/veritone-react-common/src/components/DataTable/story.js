import React from 'react';
import { range, without } from 'lodash';
import { storiesOf } from '@storybook/react';

import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'
import { Table, Column, PaginatedTable } from './';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

var data = [
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  },
  {
    created_at: 'Sat Dec 14 04:35:55 +0000 2013',
    name: 'TwitterDev',
    time_zone: 'Pacific Time (US & Canada)',
    text: 'Your official source for Twitter posts Your official source for Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts Twitter posts Your official source for Twitter posts',
    profile_image: 'https://image.flaticon.com/icons/svg/25/25305.svg',
    Attribute: 'really long attribute name', 
    Attribute2: 'description', 
    Attribute3: 'description 2',
    a: 'a',
    b: 'b',
    c: 'c'
  }
];

function renderCell(data) {
  return (
    <ResponsiveEllipsis
      text={data}
      maxLine='2'
      ellipsis='...'
      basedOn='words'
    />
  )
}


function BasicTable(props) {
  const tableEmptyMessage =
    'Nothing to see here! This table will show your engines when some exist.';

  const tableEmptyFailureMessage =
    'Engines failed to load; please try again later.';

  function getRowData(i) {
    return props.data[i];
  };

  const columns = Object.keys(props.data[0]).map((column, index) => {
    return <Column 
      dataKey={column}
      header={column}
      key={index}
      cellRenderer={renderCell}
      // style={{
      //   paddingRight: '24px'
      // }}
    />
  });

  return (
      <Table
        rowGetter={getRowData}
        rowCount={props.data.length}
        showHeader
      >
        {columns}
      </Table>
  );
}

class PagedTable extends React.Component {
  state = {
    page: 0,
    rowsPerPage: 5
  }

  getRowData = (i) => {
    return this.props.data[i];
  };

  fnPageChange = (e, page) => {
    this.setState({ page })
  }

  fnPagePerRowChange = (e) => {
    this.setState({ rowsPerPage: e.target.value })
  }

  render() {
    const tableEmptyMessage =
      'Nothing to see here! This table will show your engines when some exist.';
  
    const tableEmptyFailureMessage =
      'Engines failed to load; please try again later.';
  
    const columns = Object.keys(this.props.data[0]).map((column, index) => {
      return <Column
        dataKey={column}
        header={column}
        key={index}
        cellRenderer={renderCell}
        // style={{
        //   paddingRight: '24px'
        // }}
      />
    });
  
    return (
      <PaginatedTable
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
        page={this.state.page}
        rowsPerPage={this.state.rowsPerPage}
        showHeader
        handlePageChange={this.fnPageChange}
        handleChangeRowsPerPage={this.fnPagePerRowChange}
        onRefreshPageData={() => console.log('Refresh Me')}
        onCellClick={(i) => console.log('i:', i)}
      >
        {columns}
      </PaginatedTable>
    )
  }
}

class SplitTable extends React.Component {
  state = {
    page: 0,
    rowsPerPage: 5,
    focusedTableRow: null
  }

  getRowData = (i) => {
    return this.props.data[i];
  };

  fnPageChange = (e, page) => {
    this.setState({ page })
  }

  fnPagePerRowChange = (e) => {
    this.setState({ rowsPerPage: e.target.value })
  }

  renderFocusedRowDetails = (row) => {
    return <div style={{textAlign: 'center'}}>{row.name}</div>
  }

  setFocusedRow = (row) => {
    console.log('row:', row)
    this.setState({ focusedTableRow: row });
  }

  render() {
    console.log('%'.repeat(50))
    const tableEmptyMessage =
      'Nothing to see here! This table will show your engines when some exist.';
  
    const tableEmptyFailureMessage =
      'Engines failed to load; please try again later.';
  
    const columns = Object.keys(this.props.data[0]).map((column, index) => {
      return <Column
        dataKey={column}
        header={column}
        key={index}
        cellRenderer={renderCell}
        width={'100%'}
      />
    });
  
    return (
      <PaginatedTable
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
        page={this.state.page}
        rowsPerPage={this.state.rowsPerPage}
        showHeader
        handlePageChange={this.fnPageChange}
        handleChangeRowsPerPage={this.fnPagePerRowChange}
        onRefreshPageData={() => console.log('Refresh Me')}
        onCellClick={this.setFocusedRow}
        focusedRow={this.state.focusedTableRow}
        renderFocusedRowDetails={this.renderFocusedRowDetails}
      >
        {columns}
      </PaginatedTable>
    )
  }
}

class SelectionTable extends React.Component {
  state = {
    page: 0,
    rowsPerPage: 5,
    focusedTableRow: null,
    selectedRows: []
  }

  getRowData = (i) => {
    return this.props.data[i];
  };

  fnPageChange = (e, page) => {
    this.setState({ page })
  }

  fnPagePerRowChange = (e) => {
    this.setState({ rowsPerPage: e.target.value })
  }

  renderFocusedRowDetails = (row) => {
    return <div style={{textAlign: 'center'}}>{row.name}</div>
  }

  setFocusedRow = (row) => {
    this.setState({ focusedTableRow: row });
  }

  selectAll = (e, checked) => {
    if (!checked) {
      return this.setState({ selectedRows: [] });
    }

    return this.setState({ selectedRows: range(this.props.data.length) });
  }

  handleRowSelection = (row, checked) => {
    this.setState({
      selectedRows: checked 
        ? [...this.state.selectedRows, row] 
        : without(this.state.selectedRows, row)
    });
  }

  render() {
    const columns = Object.keys(this.props.data[0]).map((column, index) => {
      return <Column
        dataKey={column}
        header={column}
        key={index}
        cellRenderer={renderCell}
        width={100}
      />
    });
  
    return (
      <PaginatedTable
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
        page={this.state.page}
        rowsPerPage={this.state.rowsPerPage}
        showHeader
        handlePageChange={this.fnPageChange}
        handleChangeRowsPerPage={this.fnPagePerRowChange}
        onRefreshPageData={() => console.log('Refresh Me')}
        onCellClick={this.setFocusedRow}
        focusedRow={this.state.focusedTableRow}
        renderFocusedRowDetails={this.renderFocusedRowDetails}
        selectable
        selectedRows={this.state.selectedRows}
        onSelectAll={this.selectAll}
        onSelectRow={this.handleRowSelection}
      >
        {columns}
      </PaginatedTable>
    )
  }
}

storiesOf('Table', module)
  .add('Basic Table', () => (
    <BasicTable data={data}/>
  ))
  .add('Paginated Table', () => (
    <PagedTable data={data} />
  ))
  .add('Split Table', () => (
    <SplitTable data={data} />
  ))
  .add('Selection Table', () => (
    <SelectionTable data={data} /> 
  ))