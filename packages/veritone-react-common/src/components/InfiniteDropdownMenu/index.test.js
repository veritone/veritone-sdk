import React from 'react';
import { mount } from 'enzyme';
import { cloneDeep, get } from 'lodash';

import InfiniteDropdownMenu from './';

describe('InfiniteDropdownMenu', () => {
  const PAGE_SIZE = 3;
  const FAKE_ITEMS = [{
    id: '0',
    name: '0'
  }, {
    id: '1',
    name: '1'
  }, {
    id: '2',
    name: '2'
  }];

  const handleSelectionChange = state => item => {
    state.id = item.id;
  };

  const loadNextPage = state => () => {
    const fakeResults = cloneDeep(FAKE_ITEMS);
    state.items = state.items.concat(fakeResults);
  };

  it('InfiniteDropdownMenu should fetch the first page immediately', () => {
    const state = {
      hasNextPage: false,
      isNextPageLoading: false,
      items: []
    };
    const testFuncs = {
      loadNextPage: jest.fn(),
      handleSelectionChange: jest.fn()
    };
    const wrapper = mount(
      <InfiniteDropdownMenu
        handleSelectionChange={testFuncs.handleSelectionChange}
        items={state.items}
        loadNextPage={testFuncs.loadNextPage}
        hasNextPage={state.hasNextPage}
        isNextPageLoading={state.isNextPageLoading}
        pageSize={PAGE_SIZE}
      />
    );
    expect(testFuncs.loadNextPage).toHaveBeenCalledWith({
      startIndex: 0,
      stopIndex: PAGE_SIZE
    });
  });
  
  // it('Image should be rendered in a div tag.', () => {
  //   const wrapper = mount(<Image src={TEST_IMG} />);
  //   expect(wrapper.find('div')).toHaveLength(1);
  //   expect(wrapper.props().src).toBe(TEST_IMG);
  //   expect(wrapper.children().props().style.backgroundImage).toBe(`url(${TEST_IMG})`);
  // });

  // it('Image Height/Width should have default values if undefined.', () => {
  //   const wrapper = mount(<Image src={TEST_IMG} />);
  //   expect(wrapper.children().props().style.height).toBeDefined();
  //   expect(wrapper.children().props().style.width).toBeDefined();
  // });

  // it('Image Height/Width can be set to custom sizes.', () => {
  //   const HEIGHT = '123px', WIDTH = '321px';
  //   const wrapper = mount(<Image src={TEST_IMG} height={HEIGHT} width={WIDTH} />);
  //   expect(wrapper.children().props().style.height).toBe(HEIGHT);
  //   expect(wrapper.children().props().style.width).toBe(WIDTH);
  // });

  // it('Image Border can be enabled', () => {
  //   const wrapper = mount(<Image src={TEST_IMG} border />);
  //   expect(wrapper.children().props().style.border).toBe('1px solid #E4E4E4');
  // })
});
