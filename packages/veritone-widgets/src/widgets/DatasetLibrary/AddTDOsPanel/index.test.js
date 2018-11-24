import React from 'react';
import { mount } from 'enzyme';

import AddTDOsPanel from './';

describe('Dataset Library - AddTDOsPanel', () => {
  const cancel = jest.fn();
  const addTdos = jest.fn();
  const createLib = jest.fn();
  const wrapper = mount(
    <AddTDOsPanel
      datasetLibraries={[{
        id: 'testId1',
        name: 'test name 1'
      },{
        id: 'testId2',
        name: 'test name 2'
      }]}
      onCancel={cancel}
      onAddToDataset={addTdos}
      onCreateNewDataset={createLib}
    />
  );

  it('missing library selection', () => {
    expect(wrapper.find('Select')).toHaveLength(1);
  });

  it('invalid default selection', () => {
    expect(wrapper.find('Select').props().value).toEqual('testId1');
  });

  it('invalid selection list', () => {
    expect(wrapper.find('Select').props().children).toHaveLength(2);
    expect(wrapper.find('Select').props().children[0].props).toEqual({value: 'testId1', children: 'test name 1'});
    expect(wrapper.find('Select').props().children[1].props).toEqual({value: 'testId2', children: 'test name 2'});
  });

  it('invalid buttons', () => {
    const buttons = wrapper.find('Button');
    expect(buttons).toHaveLength(3);

    buttons.first().simulate('click');
    expect(cancel).toHaveBeenCalledTimes(1);

    buttons.at(1).simulate('click');
    expect(createLib).toHaveBeenCalledTimes(1);

    buttons.at(2).simulate('click');
    expect(addTdos).toHaveBeenCalledWith({
      id: 'testId1',
      name: 'test name 1'
    });
  })
});

