import React from 'react';
import { mount } from 'enzyme';
import TextField from 'material-ui/TextField';

import EngineOutputHeader from './';

describe('EngineOutputHeader', () => {
  it('should a display a title', () => {
    const wrapper = mount(
      <EngineOutputHeader title="Test Title">hello world</EngineOutputHeader>
    );

    expect(wrapper.find('.headerTitle').text()).toMatch(/Test Title/);
  })

  it('should hide the title when propTypes.hideTitle is true', () => {
    const wrapper = mount(
      <EngineOutputHeader 
        title="Test Title"
        hideTitle
      >
        hello world
      </EngineOutputHeader>
    );

    expect(wrapper.find('.headerTitle').exists()).toEqual(false);
  })

  it('should display child components', () => {
    const wrapper = mount(
      <EngineOutputHeader title="Test Title">
        <TextField
          id="testText"
          label="testText"
          value="test text field"
        />
      </EngineOutputHeader>
    );

    expect(wrapper.find('.headerActions').find(TextField).exists()).toEqual(true);
  })
});