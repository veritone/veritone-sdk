import React from 'react';
import { createStore, combineReducers } from 'redux';
import { range, filter } from 'lodash';
import { TableFooter, TableRow } from 'material-ui/Table';
import { expect } from 'chai';

import { mountWithMuiContext } from 'helpers/test/mui';
import uiStateReducer, { namespace } from 'modules/ui-state';

import { Table, Column, PaginatedTable, LOADING } from './';
import MenuColumn from './MenuColumn';

function assertRowsExist(rows, wrapper, assertion = true) {
  rows.forEach(expected => {
    expect(wrapper.find('td').someWhere(n => n.text() === expected)).to.equal(
      assertion,
      `'expected row ${expected} to exist`
    );
  });
}

function assertRowsMissing(...args) {
  return assertRowsExist(...args, false);
}

const SupressColumnWarnings = (
  { children } // eslint-disable-line
) =>
  <table>
    <tbody>
      <tr>
        {children}
      </tr>
    </tbody>
  </table>;

describe('Column', function() {
  it('Shows a loading message if data is the LOADING constant', function() {
    const wrapper = mountWithMuiContext(
      <SupressColumnWarnings>
        <Column data={LOADING} dataKey="id" />
      </SupressColumnWarnings>
    );

    expect(wrapper).to.have.text('Loading...');
  });

  it('Renders data[dataKey] as a string', function() {
    const data = {
      id: 1,
      name: 'mitch'
    };

    const idWrapper = mountWithMuiContext(
      <SupressColumnWarnings>
        <Column data={data} dataKey="id" />
      </SupressColumnWarnings>
    );
    expect(idWrapper).to.have.text('1');
    expect(idWrapper).not.to.have.text('mitch');

    const nameWrapper = mountWithMuiContext(
      <SupressColumnWarnings>
        <Column data={data} dataKey="name" />
      </SupressColumnWarnings>
    );
    expect(nameWrapper).to.have.text('mitch');
    expect(nameWrapper).not.to.have.text('1');
  });

  it('Renders nothing if data is undefined', function() {
    const wrapper = mountWithMuiContext(
      <SupressColumnWarnings>
        <Column data={undefined} dataKey="id" />
      </SupressColumnWarnings>
    );

    expect(wrapper.find('td').text()).to.equal('');
  });

  it('Uses a custom cellRenderer with the correct data, if provided', function() {
    const data = {
      id: 1,
      name: 'mitch'
    };

    const idWrapper = mountWithMuiContext(
      <SupressColumnWarnings>
        <Column
          data={data}
          dataKey="name"
          cellRenderer={d => d.toUpperCase()} // eslint-disable-line react/jsx-no-bind
        />
      </SupressColumnWarnings>
    );

    expect(idWrapper).to.have.text('MITCH');
  });
});

describe('MenuColumn', function() {
  it('shows a divider between actions and protected actions', function() {
    let data = {
      actions: ['submit', 'delete']
    };
    let wrapper = mountWithMuiContext(
      <SupressColumnWarnings>
        <MenuColumn
          data={data}
          dataKey="actions"
          protectedActions={['delete']}
        />
      </SupressColumnWarnings>
    );

    const menuItems = wrapper.find('IconMenu').prop('children');
    expect(filter(menuItems, ['type.muiName', 'Divider']).length).to.equal(1);
  });

  it('shows no divider when there are no protected actions', function() {
    let data = {
      actions: ['submit', 'delete']
    };
    let wrapper = mountWithMuiContext(
      <SupressColumnWarnings>
        <MenuColumn data={data} dataKey="actions" protectedActions={[]} />
      </SupressColumnWarnings>
    );

    const menuItems = wrapper.find('IconMenu').prop('children');
    expect(filter(menuItems, ['type.muiName', 'Divider']).length).to.equal(0);
  });

  it('shows no divider when there are only protected actions', function() {
    let data = {
      actions: ['delete']
    };
    let wrapper = mountWithMuiContext(
      <SupressColumnWarnings>
        <MenuColumn
          data={data}
          dataKey="actions"
          protectedActions={['delete']}
        />
      </SupressColumnWarnings>
    );

    const menuItems = wrapper.find('IconMenu').prop('children');
    expect(filter(menuItems, ['type.muiName', 'Divider']).length).to.equal(0);
  });
});

describe('Table', function() {
  it('Renders rows provided by the rowGetter function when given column children', function() {
    const rowGetter = i => {
      return {
        index: String(i),
        name: `col-${i}`
      };
    };

    const wrapper = mountWithMuiContext(
      <Table rowGetter={rowGetter} rowCount={2}>
        <Column dataKey="index" />
        <Column dataKey="name" />
      </Table>
    );

    const expectedCellContents = ['0', '1', 'col-0', 'col-1'];

    assertRowsExist(expectedCellContents, wrapper);
  });

  it('Renders column headers', function() {
    const wrapper = mountWithMuiContext(
      <Table
        rowGetter={() => ({})} // eslint-disable-line react/jsx-no-bind
        rowCount={1}
      >
        <Column dataKey="_" header="One" />
        <Column dataKey="_" header="Two" />
      </Table>
    );

    const expectedHeaderContents = ['One', 'Two'];

    expectedHeaderContents.forEach(expected => {
      expect(wrapper.find('th').someWhere(n => n.text() === expected)).to.equal(
        true
      );
    });
  });

  it('renders the correct row count', function() {
    const wrapper = mountWithMuiContext(
      <Table
        rowGetter={i => ({ i })} // eslint-disable-line react/jsx-no-bind
        rowCount={10}
      >
        <Column dataKey="i" />
      </Table>
    );

    expect(wrapper.find('table').find('tbody').find('tr').length).to.equal(10);
  });

  it('renders a MUI TableFooter if provided', function() {
    const footer = (
      <TableFooter id="my-footer">
        <TableRow>Footer</TableRow>
      </TableFooter>
    );

    const wrapper = mountWithMuiContext(
      <Table
        rowGetter={() => ({})} // eslint-disable-line react/jsx-no-bind
        rowCount={1}
        footerElement={footer}
      >
        <Column dataKey="_" />
      </Table>
    );

    expect(wrapper.contains(footer)).to.equal(true);
  });

  it('renders new data if data changes', function() {
    class Container extends React.Component {
      getRowData = i => {
        return this.props.data[i]; // eslint-disable-line
      };

      render() {
        return (
          <Table rowGetter={this.getRowData} rowCount={initialData.length}>
            <Column dataKey="id" header="id" />
          </Table>
        );
      }
    }

    const initialData = [{ id: 0 }, { id: 1 }];

    const wrapper = mountWithMuiContext(<Container data={initialData} />);

    wrapper.setProps(
      {
        data: [{ id: 0 }, { id: '1-new' }]
      },
      function() {
        expect(
          wrapper.find('td').someWhere(n => n.text() === '1-new')
        ).to.equal(true);
      }
    );
  });

  describe('callback behavior', function() {
    xit('calls onShowCellRange with the correct data on mount', function() {
      let calledWith = null;
      const handleShowCellRange = range => {
        calledWith = range;
      };

      mountWithMuiContext(
        <Table
          rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
          rowCount={10}
          onShowCellRange={handleShowCellRange}
        >
          <Column dataKey="id" />
        </Table>
      );

      expect(calledWith).to.eql({ start: 0, end: 9 });
    });

    xit(
      'calls onShowCellRange with the correct data when props.watchData changes',
      function() {
        let calledWith = null;
        let calledCount = 0;
        const handleShowCellRange = range => {
          calledWith = range;
          calledCount++;
        };

        const data = [1];
        let wrapper = mountWithMuiContext(
          <Table
            rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
            rowCount={10}
            onShowCellRange={handleShowCellRange}
            watchData={data}
          >
            <Column dataKey="id" />
          </Table>
        );

        expect(calledWith).to.eql({ start: 0, end: 9 });
        expect(calledCount).to.equal(1);

        // stuff happens but data doesn't change
        wrapper.update();
        wrapper.setProps({ data: data });

        // data changes
        wrapper.setProps({ watchData: [] });
        expect(calledWith).to.eql({ start: 0, end: 9 });
        expect(calledCount).to.equal(2);
      }
    );
  });

  describe('loading behavior', function() {
    it('Renders LOADING cells correctly', function() {
      const wrapper = mountWithMuiContext(
        <Table
          rowGetter={i => LOADING} // eslint-disable-line react/jsx-no-bind
          rowCount={10}
        >
          <Column dataKey="id" />
        </Table>
      );

      expect(wrapper.find('td').everyWhere(n => n.text().match(/loading/i))).to
        .be.true;
    });

    it('Renders a mix of loading and not-loading cells', function() {
      const wrapper = mountWithMuiContext(
        <Table
          rowGetter={i => (i % 2 === 0 ? LOADING : { id: i })} // eslint-disable-line react/jsx-no-bind
          rowCount={10}
        >
          <Column dataKey="id" />
        </Table>
      );

      expect(
        wrapper.find('td').everyWhere((n, i) => {
          return i % 2 === 0
            ? n.text().match(/loading/i)
            : n.text().match(new RegExp(i));
        })
      ).to.be.true;
    });
  });
});

describe('PaginatedTable', function() {
  beforeEach(function() {
    this.mockReduxStore = createStore(
      combineReducers(
        {
          [namespace]: uiStateReducer
        },
        {}
      )
    );
  });

  afterEach(function() {
    this.mockReduxStore = null;
  });

  it('renders rows for the first page', function() {
    const wrapper = mountWithMuiContext(
      <PaginatedTable
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
        initialItemsPerPage={20}
        store={this.mockReduxStore}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    const expectedCellContents = range(0, 20).map(i => `row-${i}`);

    assertRowsExist(expectedCellContents, wrapper);
  });

  it(
    'renders a footer that allows navigation between pages, displays the ' +
      'correct rows per page',
    function() {
      const perPage = 12;
      const rowCount = 30;

      const wrapper = mountWithMuiContext(
        <PaginatedTable
          initialItemsPerPage={perPage}
          rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
          rowCount={30}
          store={this.mockReduxStore}
        >
          <Column dataKey="id" />
        </PaginatedTable>
      );

      const pageOneExpectedContents = range(0, perPage).map(i => `row-${i}`);
      const pageTwoExpectedContents = range(perPage, perPage * 2).map(
        i => `row-${i}`
      );
      const pageThreeExpectedContents = range(perPage * 2, rowCount).map(
        i => `row-${i}`
      );

      wrapper.find('.pageRight').simulate('click');
      assertRowsExist(pageTwoExpectedContents, wrapper);
      assertRowsMissing(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageThreeExpectedContents, wrapper);

      wrapper.find('.pageRight').simulate('click');
      assertRowsExist(pageThreeExpectedContents, wrapper);
      assertRowsMissing(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageTwoExpectedContents, wrapper);

      // too far, not allowed, noop
      wrapper.find('.pageRight').simulate('click');
      assertRowsExist(pageThreeExpectedContents, wrapper);
      assertRowsMissing(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageTwoExpectedContents, wrapper);

      wrapper.find('.pageLeft').simulate('click');
      assertRowsExist(pageTwoExpectedContents, wrapper);
      assertRowsMissing(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageThreeExpectedContents, wrapper);

      wrapper.find('.pageLeft').simulate('click');
      assertRowsExist(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageTwoExpectedContents, wrapper);
      assertRowsMissing(pageThreeExpectedContents, wrapper);

      // too far, not allowed, noop
      wrapper.find('.pageLeft').simulate('click');
      assertRowsExist(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageTwoExpectedContents, wrapper);
      assertRowsMissing(pageThreeExpectedContents, wrapper);
    }
  );

  it('renders a refresh button into the footer if onRefreshPageData is provided', function() {
    let calledWith;

    const wrapper = mountWithMuiContext(
      <PaginatedTable
        initialItemsPerPage={12}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
        store={this.mockReduxStore}
        onRefreshPageData={range => (calledWith = range)} // eslint-disable-line react/jsx-no-bind
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    wrapper.find('.refresh').simulate('click');
    expect(calledWith).to.eql({ start: 0, end: 11 });

    wrapper.find('.pageRight').simulate('click');
    wrapper.find('.refresh').simulate('click');
    expect(calledWith).to.eql({ start: 12, end: 23 });
  });

  it('renders a select element in the footer that changes the number of rows per page', function() {
    const wrapper = mountWithMuiContext(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
        store={this.mockReduxStore}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    expect(wrapper.find('SelectField')).to.exist;

    wrapper.find('PaginatedTableFooter').prop('onChangePerPage')({
      target: { value: 20 }
    });
    // .simulate('change', { target: { value: 20 } }); // why doesn't this work?

    const expectedRows = range(0, 20).map(i => `row-${i}`);
    assertRowsExist(expectedRows, wrapper);
    assertRowsMissing(range(20, 30), wrapper);
  });

  it('moves back to the first page where rows exist when perPage changes', function() {
    const wrapper = mountWithMuiContext(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
        store={this.mockReduxStore}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    // move to page 3
    wrapper.find('.pageRight').simulate('click');
    wrapper.find('.pageRight').simulate('click');

    // 30 rows per page means all rows are displayed on page 1;
    // expect pagination to move back to page 1
    // wrapper.find('.perPage')
    //   .simulate('change', { target: { value: 30 } });
    wrapper.find('PaginatedTableFooter').prop('onChangePerPage')({
      target: { value: 30 }
    });
    const expectedRows = range(0, 30).map(i => `row-${i}`);
    assertRowsExist(expectedRows, wrapper);
  });

  it('moves back to the first page where rows exist when rowCount changes', function() {
    const wrapper = mountWithMuiContext(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
        store={this.mockReduxStore}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    // move to page 3
    wrapper.find('.pageRight').simulate('click');
    wrapper.find('.pageRight').simulate('click');

    expect(wrapper.find('PaginatedTableFooter').prop('page')).to.equal(2);

    wrapper.setProps({ rowCount: 5 });

    const expectedRows = range(0, 5).map(i => `row-${i}`);
    assertRowsExist(expectedRows, wrapper);

    expect(wrapper.find('PaginatedTableFooter').prop('page')).to.equal(0);
  });

  it('does not move back to page -1 on perPage changes and rowCount=0', function() {
    const wrapper = mountWithMuiContext(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={0}
        store={this.mockReduxStore}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    wrapper.find('PaginatedTableFooter').prop('onChangePerPage')({
      target: { value: 30 }
    });

    expect(wrapper.find('PaginatedTableFooter').prop('page')).to.equal(0);
  });

  it('renders only up to rowCount if rowCount < perPage', function() {
    const wrapper = mountWithMuiContext(
      <PaginatedTable
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={10}
        initialItemsPerPage={20}
        store={this.mockReduxStore}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    expect(wrapper.find('tr').length).to.equal(10 + 2); // +2 -- header/footer

    const expectedCellContents = range(0, 10).map(i => `row-${i}`);
    assertRowsExist(expectedCellContents, wrapper);

    const shouldNotExistCellContents = range(10, 20).map(i => `row-${i}`);
    assertRowsExist(shouldNotExistCellContents, wrapper, false);
  });

  describe('callback behavior', function() {
    it('calls onShowCellRange with the correct data', function() {
      let calledWith = null;
      const handleShowCellRange = range => {
        calledWith = range;
      };

      const wrapper = mountWithMuiContext(
        <PaginatedTable
          initialItemsPerPage={10}
          rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
          rowCount={30}
          onShowCellRange={handleShowCellRange}
          store={this.mockReduxStore}
        >
          <Column dataKey="id" />
        </PaginatedTable>
      );

      wrapper.find('.pageRight').simulate('click');
      expect(calledWith).to.eql({ start: 10, end: 19 });

      wrapper.find('.pageRight').simulate('click');
      expect(calledWith).to.eql({ start: 20, end: 29 });

      wrapper.find('.pageLeft').simulate('click');
      expect(calledWith).to.eql({ start: 10, end: 19 });

      wrapper.setProps({ rowCount: 0 });
      expect(calledWith).to.eql(
        { start: 0, end: 9 },
        "calls for full page even if rowCount says data doesn't exist"
      );
    });
  });
});

describe('Table with focused row', function() {
  it('breaks out a row when that row is focused', function() {
    function renderDetails(data) {
      return (
        <h3 id="details">
          {data.id}
        </h3>
      );
    }

    const unfocusedWrapper = mountWithMuiContext(
      <Table
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={10}
        renderFocusedRowDetails={renderDetails}
      >
        <Column dataKey="id" />
      </Table>
    );

    expect(unfocusedWrapper.find('#details')).to.not.exist;

    const focusedWrapper = mountWithMuiContext(
      <Table
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={10}
        renderFocusedRowDetails={renderDetails}
        focusedRow={2}
      >
        <Column dataKey="id" />
      </Table>
    );

    expect(focusedWrapper.find('#details').text()).to.equal('row-2');
  });

  it('works in paginated tables', function() {
    const mockReduxStore = createStore(
      combineReducers(
        {
          [namespace]: uiStateReducer
        },
        {}
      )
    );

    function renderDetails(data = {}) {
      return (
        <h3 id="details">
          {data.id}
        </h3>
      );
    }

    const wrapper = mountWithMuiContext(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={11}
        renderFocusedRowDetails={renderDetails}
        focusedRow={2}
        store={mockReduxStore}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    expect(wrapper.find('#details').text()).to.equal('row-2');

    wrapper.find('.pageRight').simulate('click');
    expect(wrapper.find('#details')).to.not.exist;

    wrapper.find('.pageLeft').simulate('click');
    expect(wrapper.find('#details').text()).to.equal('row-2');
  });
});
