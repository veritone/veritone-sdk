import React from 'react';
import { mount } from 'enzyme';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import IconButton from 'material-ui/IconButton';

import EngineOutputHeader from './';

describe('EngineOutputHeader', () => {
  it('should a display a title', () => {
    const wrapper = mount(
      <EngineOutputHeader title="Test Title">hello world</EngineOutputHeader>
    );

    expect(wrapper.find('.headerTitle').text()).toMatch(/Test Title/);
  });

  it('should hide the title when propTypes.hideTitle is true', () => {
    const wrapper = mount(
      <EngineOutputHeader title="Test Title" hideTitle>
        hello world
      </EngineOutputHeader>
    );

    expect(wrapper.find('.headerTitle').exists()).toEqual(false);
  });

  it('should display child components', () => {
    const wrapper = mount(
      <EngineOutputHeader title="Test Title">
        <TextField id="testText" label="testText" value="test text field" />
      </EngineOutputHeader>
    );

    expect(
      wrapper
        .find('.headerActions')
        .find(TextField)
        .exists()
    ).toEqual(true);
  });

  it('should display a select if an array of engines is provided', () => {
    let engines = [
      {
        name: 'My test engine',
        id: '1234-5678-9876'
      },
      {
        name: 'My test engine 2',
        id: '0987-6543-1234'
      }
    ];

    const wrapper = mount(
      <EngineOutputHeader title="Test Title" engines={engines} />
    );

    expect(wrapper.find(Select).exists()).toEqual(true);
  });

  it('should call onExpandClick to be called when the expand button is clicked', () => {
    const expandClicked = jest.fn();
    const wrapper = mount(
      <EngineOutputHeader title="Test Title" onExpandClick={expandClicked} />
    );
    let expandButton = wrapper.find(IconButton);
    expandButton.simulate('click');
    expect(expandClicked).toHaveBeenCalled();
  });
});
