import React from 'react';
import { constant } from 'lodash';

import { mount } from 'enzyme';

import { Table, Column } from './';

describe('withBasicBehavior', function() {
  it("shows the Column's loading indicator for loading rows", function() {
    const rowData = {
      0: { id: 'a' },
      2: { id: 'c' }
    };
    const loadingIndices = [1, 3];

    const wrapper = mount(
      <Table
        rowGetter={i => rowData[i]} // eslint-disable-line react/jsx-no-bind
        rowCount={4}
        loadingIndices={loadingIndices}
      >
        <Column dataKey="id" />
      </Table>
    );

    expect(
      wrapper
        .find('td')
        .at(0)
        .text()
    ).toEqual('a');

    expect(
      wrapper
        .find('td')
        .at(1)
        .text()
    ).toEqual('Loading...');

    expect(
      wrapper
        .find('td')
        .at(2)
        .text()
    ).toEqual('c');

    expect(
      wrapper
        .find('td')
        .at(3)
        .text()
    ).toEqual('Loading...');
  });

  it('shows the empty failure message', function() {
    const wrapper = mount(
      <Table
        rowGetter={constant(null)} // eslint-disable-line react/jsx-no-bind
        rowCount={0}
        failedLoadingIndices={[1]}
        emptyFailureMessage="works"
      >
        <Column dataKey="id" />
      </Table>
    );

    expect(wrapper.find('td').text()).toContain('works');
  });

  it('shows the empty loading message', function() {
    const wrapper = mount(
      <Table
        rowGetter={constant(null)} // eslint-disable-line react/jsx-no-bind
        rowCount={0}
        loadingIndices={[1]}
        loadingMessage="works"
      >
        <Column dataKey="id" />
      </Table>
    );

    expect(wrapper.find('td').text()).toContain('works');
  });

  it('shows the empty/no data message', function() {
    const wrapper = mount(
      <Table
        rowGetter={constant(null)} // eslint-disable-line react/jsx-no-bind
        rowCount={0}
        emptyMessage="works"
      >
        <Column dataKey="id" />
      </Table>
    );

    expect(wrapper.find('td').text()).toContain('works');
  });

  it('allows emptyRenderer to be overwritten', function() {
    const wrapper = mount(
      <Table
        rowGetter={constant(null)} // eslint-disable-line react/jsx-no-bind
        rowCount={0}
        emptyRenderer={() => <div>works</div>} // eslint-disable-line react/jsx-no-bind
      >
        <Column dataKey="id" />
      </Table>
    );

    expect(wrapper.find('td').text()).toContain('works');
  });

  it('does not show loading indicators for data that already exists', function() {
    const rowData = {
      0: { id: 'a' }
    };
    const loadingIndices = [0, 1];

    const wrapper = mount(
      <Table
        rowGetter={i => rowData[i]} // eslint-disable-line react/jsx-no-bind
        rowCount={2}
        loadingIndices={loadingIndices}
      >
        <Column dataKey="id" />
      </Table>
    );

    expect(
      wrapper
        .find('td')
        .at(0)
        .text()
    ).toEqual('a');

    expect(
      wrapper
        .find('td')
        .at(1)
        .text()
    ).toEqual('Loading...');
  });
});
