import React from 'react';
import { storiesOf } from '@storybook/react';

import { arrayOf, object } from 'prop-types';
import DotDotDot from 'react-dotdotdot'
import MuiTable, { TableBody, TableRow } from 'material-ui/Table';
import MenuColumn from './MenuColumn';
import { Table, Column, PaginatedTable } from './';

const data = [
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
    <DotDotDot clamp={2}>
      {data}
    </DotDotDot>
  )
}


function BasicTable({ data }) {
  function getRowData(i) {
    return data[i];
  };
  

  const columns = Object.keys(data[0]).map((column, index) => {
    return <Column 
      dataKey={column}
      header={column}
      key={index}
      cellRenderer={renderCell}
    />
  });

  return (
      <Table
        rowGetter={getRowData}
        rowCount={data.length}
        showHeader
      >
        {columns}
      </Table>
  );
}

BasicTable.propTypes = {
  data: arrayOf(object)
}

class PagedTable extends React.Component {
  getRowData = (i) => {
    return this.props.data[i];
  };
  
  handleOnRefreshPageData = () => {
    return console.log('Refresh Me');
  }

  handleOnCellClick = (i) => {
    return console.log('i:', i)
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
      />
    });
  
    return (
      <PaginatedTable
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
        initialItemsPerPage={5}
        showHeader
        onRefreshPageData={this.handleOnRefreshPageData}
        onCellClick={this.handleOnCellClick}
        emptyMessage={tableEmptyMessage}
        emptyFailureMessage={tableEmptyFailureMessage}
      >
        {columns}
      </PaginatedTable>
    )
  }
}

PagedTable.propTypes = {
  data: arrayOf(object)
}

class SplitTable extends React.Component {
  state = {
    rowsPerPage: 5,
    focusedTableRow: null
  }

  getRowData = (i) => {
    return this.props.data[i];
  };

  renderFocusedRowDetails = (row) => {
    return <div style={{textAlign: 'center'}}>{row.name}</div>
  }

  setFocusedRow = (row) => {
    this.setState({ focusedTableRow: row });
  }

  handleOnRefreshPageData = () => {
    return console.log('Refresh Me');
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
        align="center"
        width={100}
      />
    });
  
    return (
      <PaginatedTable
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
        showHeader
        onRefreshPageData={this.handleOnRefreshPageData}
        onCellClick={this.setFocusedRow}
        focusedRow={this.state.focusedTableRow}
        renderFocusedRowDetails={this.renderFocusedRowDetails}
        emptyMessage={tableEmptyMessage}
        emptyFailureMessage={tableEmptyFailureMessage}
      >
        {columns}
      </PaginatedTable>
    )
  }
}

SplitTable.propTypes = {
  data: arrayOf(object)
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
  })