import React from 'react';
import { wrapInTestContext } from 'react-dnd-test-utils';
import { mount } from 'enzyme';

import Block from './';

const MockIcon = <div  />;

describe('FormBlocks', () => {
  it('Should render a FormBlocks', () => {
    const DraggableBlock = wrapInTestContext(Block);
    const wrapper = mount(
      <DraggableBlock
        type="form-items"
        label="DragLabel"
        icon={MockIcon}
      />
    )
    expect(wrapper.text()).toBe('DragLabel');
  })
});
