import React from 'react';
import { range, filter, get, includes, map, uppercase } from 'lodash';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Menu from '@material-ui/core/Menu';
import Select from '@material-ui/core/Select';

import { mount } from 'enzyme';
import MenuColumn from './MenuColumn';
import { LOADING } from './shared';
import { Table, Column, PaginatedTable } from './';

function assertRowsExist(rows, wrapper, assertion = true) {
  rows.forEach(expected => {
    expect(wrapper.find('td').someWhere(n => n.text() === expected)).toEqual(
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
) => (
  <MuiTable>
    <TableBody>
      <TableRow>{children}</TableRow>
    </TableBody>
  </MuiTable>
);

describe('Column', function() {
  it('Shows a loading message if data is the LOADING constant', function() {
    const wrapper = mount(
      <SupressColumnWarnings>
        <Column data={LOADING} dataKey="id" />
      </SupressColumnWarnings>
    );

    expect(wrapper.text()).toEqual('Loading...');
  });

  it('Renders data[dataKey] as a string', function() {
    const data = {
      id: 1,
      name: 'mitch'
    };

    const idWrapper = mount(
      <SupressColumnWarnings>
        <Column data={data} dataKey="id" />
      </SupressColumnWarnings>
    );
    expect(idWrapper.text()).toEqual('1');
    expect(idWrapper.text()).not.toEqual('mitch');

    const nameWrapper = mount(
      <SupressColumnWarnings>
        <Column data={data} dataKey="name" />
      </SupressColumnWarnings>
    );
    expect(nameWrapper.text()).toEqual('mitch');
    expect(nameWrapper.text()).not.toEqual('1');
  });

  it("Renders nested 'dataKey' value", function() {
    const data = {
      id: 1,
      profile: {
        name: 'mitch',
        employer: {
          name: 'Veritone',
          team: 'Apps'
        }
      }
    };

    const nameWrapper = mount(
      <SupressColumnWarnings>
        <Column data={data} dataKey="profile.name" />
      </SupressColumnWarnings>
    );
    expect(nameWrapper.text()).toEqual(data.profile.name);

    const teamWrapper = mount(
      <SupressColumnWarnings>
        <Column data={data} dataKey={['profile', 'employer', 'team']} />
      </SupressColumnWarnings>
    );

    expect(teamWrapper.text()).toEqual(data.profile.employer.team);

    const employerWrapper = mount(
      <SupressColumnWarnings>
        <Column
          data={data}
          dataKey={['profile', 'employer', 'name']}
          cellRenderer={uppercase}
        />
      </SupressColumnWarnings>
    );
    expect(employerWrapper.text()).toEqual(
      uppercase(data.profile.employer.name)
    );
  });

  it('Renders nothing if data is undefined', function() {
    const wrapper = mount(
      <SupressColumnWarnings>
        <Column data={undefined} dataKey="id" />
      </SupressColumnWarnings>
    );

    expect(wrapper.find('td').text()).toEqual('');
  });

  it('Uses a custom cellRenderer with the correct data, if provided', function() {
    const data = {
      id: 1,
      name: 'mitch'
    };

    const idWrapper = mount(
      <SupressColumnWarnings>
        <Column
          data={data}
          dataKey="name"
          cellRenderer={d => d.toUpperCase()} // eslint-disable-line react/jsx-no-bind
        />
      </SupressColumnWarnings>
    );

    expect(idWrapper.text()).toEqual('MITCH');
  });
});

describe('MenuColumn', function() {
  it('shows a divider between actions and protected actions', function() {
    let data = {
      actions: ['submit', 'delete']
    };
    let wrapper = mount(
      <SupressColumnWarnings>
        <MenuColumn
          data={data}
          dataKey="actions"
          protectedActions={['delete']}
        />
      </SupressColumnWarnings>
    );

    const menuItems = wrapper.find(Menu).prop('children');
    expect(
      filter(menuItems, menuItem => includes(get(menuItem, 'key'), 'divider'))
        .length
    ).toEqual(1);
  });

  it('shows no divider when there are no protected actions', function() {
    let data = {
      actions: ['submit', 'delete']
    };
    let wrapper = mount(
      <SupressColumnWarnings>
        <MenuColumn data={data} dataKey="actions" protectedActions={[]} />
      </SupressColumnWarnings>
    );

    const menuItems = wrapper.find(Menu).prop('children');
    expect(
      filter(menuItems, menuItem => includes(get(menuItem, 'key'), 'divider'))
        .length
    ).toEqual(0);
  });

  it('shows no divider when there are only protected actions', function() {
    let data = {
      actions: ['delete']
    };
    let wrapper = mount(
      <SupressColumnWarnings>
        <MenuColumn
          data={data}
          dataKey="actions"
          protectedActions={['delete']}
        />
      </SupressColumnWarnings>
    );

    const menuItems = wrapper.find(Menu).prop('children');
    expect(
      filter(menuItems, menuItem => includes(get(menuItem, 'key'), 'divider'))
        .length
    ).toEqual(0);
  });

  it('excludes specified actions', function() {
    const data = {
      actions: ['delete', 'alter', 'manage']
    };
    const wrapper = mount(
      <SupressColumnWarnings>
        <MenuColumn
          data={data}
          dataKey="actions"
          protectedActions={['delete']}
          excludeActions={['alter']}
        />
      </SupressColumnWarnings>
    );

    const menuItems = wrapper.find(Menu).prop('children');
    expect(map(menuItems, 'key')).not.toContain('alter');
    expect(map(menuItems, 'key')).toEqual(
      expect.arrayContaining(['delete', 'manage'])
    );
  });

  it('accepts static list of actions', function() {
    const data = {
      title: 'Text',
      desc: 'Desc'
    };
    const actions = ['delete', 'alter', 'manage'];

    const wrapper = mount(
      <SupressColumnWarnings>
        <MenuColumn
          data={data}
          actions={actions}
          protectedActions={['delete']}
        />
      </SupressColumnWarnings>
    );

    const menuItems = wrapper.find(Menu).prop('children');
    expect(map(menuItems, 'key')).toEqual(expect.arrayContaining(actions));
  });
});

describe('Table', function() {
  it('Renders rows provided by the rowGetter function when given column children', function() {
    function rowGetter(i) {
      return {
        index: String(i),
        name: `col-${i}`
      };
    }

    const wrapper = mount(
      <Table rowGetter={rowGetter} rowCount={2}>
        <Column dataKey="index" />
        <Column dataKey="name" />
      </Table>
    );

    const expectedCellContents = ['0', '1', 'col-0', 'col-1'];

    assertRowsExist(expectedCellContents, wrapper);
  });

  it('Renders column headers', function() {
    const wrapper = mount(
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
      expect(wrapper.find('th').someWhere(n => n.text() === expected)).toEqual(
        true
      );
    });
  });

  it('renders the correct row count', function() {
    const wrapper = mount(
      <Table
        rowGetter={i => ({ i })} // eslint-disable-line react/jsx-no-bind
        rowCount={10}
      >
        <Column dataKey="i" />
      </Table>
    );

    expect(
      wrapper
        .find('table')
        .find('tbody')
        .find('tr').length
    ).toEqual(10);
  });

  it('renders a MUI TableFooter if provided', function() {
    const footer = (
      <TableCell id="my-footer">
        <div>Footer</div>
      </TableCell>
    );

    const wrapper = mount(
      <Table
        rowGetter={() => ({})} // eslint-disable-line react/jsx-no-bind
        rowCount={1}
        footerElement={footer}
      >
        <Column dataKey="_" />
      </Table>
    );

    expect(wrapper.contains(footer)).toEqual(true);
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

    const wrapper = mount(<Container data={initialData} />);

    wrapper.setProps(
      {
        data: [{ id: 0 }, { id: '1-new' }]
      },
      function() {
        expect(wrapper.find('td').someWhere(n => n.text() === '1-new')).toEqual(
          true
        );
      }
    );
  });

  it('exposes row index and column key when table cell is clicked', function() {
    const handler = jest.fn();

    class Container extends React.Component {
      getRowData = i => {
        return this.props.data[i]; // eslint-disable-line
      };

      render() {
        return (
          <Table
            rowGetter={this.getRowData}
            rowCount={initialData.length}
            onCellClick={handler}
          >
            <Column dataKey="id" header="id" />
          </Table>
        );
      }
    }

    const initialData = [{ id: 0 }, { id: 1 }];
    const wrapper = mount(<Container data={initialData} />);

    wrapper
      .find('td')
      .last()
      .simulate('click');

    expect(handler.mock.calls[0][0]).toBe(1);
    expect(handler.mock.calls[0][1]).toBe('id');
  });

  describe('callback behavior', function() {
    xit('calls onShowCellRange with the correct data on mount', function() {
      let calledWith = null;
      function handleShowCellRange(range) {
        calledWith = range;
      }

      mount(
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

    xit('calls onShowCellRange with the correct data when props.watchData changes', function() {
      let calledWith = null;
      let calledCount = 0;
      function handleShowCellRange(range) {
        calledWith = range;
        calledCount++;
      }

      const data = [1];
      let wrapper = mount(
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
      expect(calledCount).toEqual(1);

      // stuff happens but data doesn't change
      wrapper.update();
      wrapper.setProps({ data: data });

      // data changes
      wrapper.setProps({ watchData: [] });
      expect(calledWith).to.eql({ start: 0, end: 9 });
      expect(calledCount).toEqual(2);
    });
  });

  describe('loading behavior', function() {
    it('Renders LOADING cells correctly', function() {
      const wrapper = mount(
        <Table
          rowGetter={i => LOADING} // eslint-disable-line react/jsx-no-bind
          rowCount={10}
        >
          <Column dataKey="id" />
        </Table>
      );

      // expect(wrapper.find('td').everyWhere(n => n.text().match(/loading/i))).to.be.true;
      expect(
        wrapper.find('td').everyWhere(n => n.text().match(/loading/i))
      ).toBeTruthy();
    });

    it('Renders a mix of loading and not-loading cells', function() {
      const wrapper = mount(
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
      ).toBeTruthy();
    });
  });
});

describe('PaginatedTable', function() {
  it('renders rows for the first page', function() {
    const wrapper = mount(
      <PaginatedTable
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
        initialItemsPerPage={20}
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

      const wrapper = mount(
        <PaginatedTable
          initialItemsPerPage={perPage}
          rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
          rowCount={30}
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

      wrapper
        .find('.pageRight')
        .at(0)
        .simulate('click');
      assertRowsExist(pageTwoExpectedContents, wrapper);
      assertRowsMissing(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageThreeExpectedContents, wrapper);

      wrapper
        .find('.pageRight')
        .at(0)
        .simulate('click');
      assertRowsExist(pageThreeExpectedContents, wrapper);
      assertRowsMissing(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageTwoExpectedContents, wrapper);

      // too far, not allowed, noop
      wrapper
        .find('.pageRight')
        .at(0)
        .simulate('click');
      assertRowsExist(pageThreeExpectedContents, wrapper);
      assertRowsMissing(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageTwoExpectedContents, wrapper);

      wrapper
        .find('.pageLeft')
        .at(0)
        .simulate('click');
      assertRowsExist(pageTwoExpectedContents, wrapper);
      assertRowsMissing(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageThreeExpectedContents, wrapper);

      wrapper
        .find('.pageLeft')
        .at(0)
        .simulate('click');
      assertRowsExist(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageTwoExpectedContents, wrapper);
      assertRowsMissing(pageThreeExpectedContents, wrapper);

      // too far, not allowed, noop
      wrapper
        .find('.pageLeft')
        .at(0)
        .simulate('click');
      assertRowsExist(pageOneExpectedContents, wrapper);
      assertRowsMissing(pageTwoExpectedContents, wrapper);
      assertRowsMissing(pageThreeExpectedContents, wrapper);
    }
  );

  it('renders a refresh button into the footer if onRefreshPageData is provided', function() {
    let calledWith;

    const wrapper = mount(
      <PaginatedTable
        initialItemsPerPage={12}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
        onRefreshPageData={range => (calledWith = range)} // eslint-disable-line react/jsx-no-bind
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    wrapper
      .find('.refresh')
      .at(0)
      .simulate('click');
    expect(calledWith).toEqual({ start: 0, end: 11 });

    wrapper
      .find('.pageRight')
      .at(0)
      .simulate('click');
    wrapper
      .find('.refresh')
      .at(0)
      .simulate('click');
    expect(calledWith).toEqual({ start: 12, end: 23 });
  });

  it('renders a select element in the footer that changes the number of rows per page', function() {
    const wrapper = mount(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    expect(wrapper.find(Select).exists()).toBeTruthy();

    wrapper.find('PaginatedTableFooter').prop('onChangePerPage')({
      target: { value: 20 }
    });
    // .simulate('change', { target: { value: 20 } }); // why doesn't this work?
    wrapper.update();

    const expectedRows = range(0, 20).map(i => `row-${i}`);
    assertRowsExist(expectedRows, wrapper);
    assertRowsMissing(range(20, 30), wrapper);
  });

  it('moves back to the first page where rows exist when perPage changes', function() {
    const wrapper = mount(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    // move to page 3
    wrapper
      .find('.pageRight')
      .at(0)
      .simulate('click');
    wrapper
      .find('.pageRight')
      .at(0)
      .simulate('click');

    // 30 rows per page means all rows are displayed on page 1;
    // expect pagination to move back to page 1
    // wrapper.find('.perPage')
    //   .simulate('change', { target: { value: 30 } });
    wrapper.find('PaginatedTableFooter').prop('onChangePerPage')({
      target: { value: 30 }
    });

    wrapper.update();

    const expectedRows = range(0, 30).map(i => `row-${i}`);
    assertRowsExist(expectedRows, wrapper);
  });

  it('moves back to the first page where rows exist when rowCount changes', function() {
    const wrapper = mount(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={30}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    // move to page 3
    wrapper
      .find('.pageRight')
      .at(0)
      .simulate('click');
    wrapper
      .find('.pageRight')
      .at(0)
      .simulate('click');

    expect(wrapper.find('PaginatedTableFooter').prop('page')).toEqual(2);

    wrapper.setProps({ rowCount: 5 }).update();

    const expectedRows = range(0, 5).map(i => `row-${i}`);
    assertRowsExist(expectedRows, wrapper);

    expect(wrapper.find('PaginatedTableFooter').prop('page')).toEqual(0);
  });

  it('does not move back to page -1 on perPage changes and rowCount=0', function() {
    const wrapper = mount(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={0}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    wrapper.find('PaginatedTableFooter').prop('onChangePerPage')({
      target: { value: 30 }
    });

    expect(wrapper.find('PaginatedTableFooter').prop('page')).toEqual(0);
  });

  it('renders only up to rowCount if rowCount < perPage', function() {
    const wrapper = mount(
      <PaginatedTable
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={10}
        initialItemsPerPage={20}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    expect(wrapper.find('tr').length).toEqual(10 + 2); // +2 -- header/footer

    const expectedCellContents = range(0, 10).map(i => `row-${i}`);
    assertRowsExist(expectedCellContents, wrapper);

    const shouldNotExistCellContents = range(10, 20).map(i => `row-${i}`);
    assertRowsExist(shouldNotExistCellContents, wrapper, false);
  });

  describe('callback behavior', function() {
    it('calls onShowCellRange with the correct data', function() {
      let calledWith = null;
      function handleShowCellRange(range) {
        calledWith = range;
      }

      const wrapper = mount(
        <PaginatedTable
          initialItemsPerPage={10}
          rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
          rowCount={30}
          onShowCellRange={handleShowCellRange}
        >
          <Column dataKey="id" />
        </PaginatedTable>
      );

      wrapper
        .find('.pageRight')
        .at(0)
        .simulate('click');
      expect(calledWith).toEqual({ start: 10, end: 19 });

      wrapper
        .find('.pageRight')
        .at(0)
        .simulate('click');
      expect(calledWith).toEqual({ start: 20, end: 29 });

      wrapper
        .find('.pageLeft')
        .at(0)
        .simulate('click');
      expect(calledWith).toEqual({ start: 10, end: 19 });

      wrapper.setProps({ rowCount: 0 });
      expect(calledWith).toEqual(
        { start: 0, end: 9 },
        "calls for full page even if rowCount says data doesn't exist"
      );
    });
  });
});

describe('Table with focused row', function() {
  it('breaks out a row when that row is focused', function() {
    function renderDetails(data) {
      return <h3 id="details">{data.id}</h3>;
    }

    const unfocusedWrapper = mount(
      <Table
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={10}
        renderFocusedRowDetails={renderDetails}
      >
        <Column dataKey="id" />
      </Table>
    );

    expect(unfocusedWrapper.find('#details').exists()).toEqual(false);

    const focusedWrapper = mount(
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

    expect(focusedWrapper.find('#details').text()).toEqual('row-2');
  });

  it('works in paginated tables', function() {
    function renderDetails(data = {}) {
      return <h3 id="details">{data.id}</h3>;
    }

    const wrapper = mount(
      <PaginatedTable
        initialItemsPerPage={10}
        rowGetter={i => ({ id: `row-${i}` })} // eslint-disable-line react/jsx-no-bind
        rowCount={11}
        renderFocusedRowDetails={renderDetails}
        focusedRow={2}
      >
        <Column dataKey="id" />
      </PaginatedTable>
    );

    expect(wrapper.find('#details').text()).toEqual('row-2');

    wrapper
      .find('.pageRight')
      .at(0)
      .simulate('click');
    expect(wrapper.find('#details').exists()).toEqual(false);

    wrapper
      .find('.pageLeft')
      .at(0)
      .simulate('click');
    expect(wrapper.find('#details').text()).toEqual('row-2');
  });
});
