import React from 'react';
import { mount } from 'enzyme';

import Snippet from './';

describe('Snippet', function() {
  it('shows the text', function () {
    const wrapper = mount(<Snippet text="testsnippettext" />);
    expect(wrapper.find("span").text()).toMatch(/testsnippettext/);
  });
});