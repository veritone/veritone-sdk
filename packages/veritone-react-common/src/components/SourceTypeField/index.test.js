import React from 'react';
import { mount } from 'enzyme';

import SourceTypeField from './';

describe('RaisedTextField', function () {
  it('render\'s field for supported type', () => {
    const wrapper = mount(
      <SourceTypeField
        id="username"
        type="string"
        title="User Name"
      />
    );

    expect(wrapper.find("input[id='username']")).toHaveLength(1);
  });

  it('doesn\'t render field for unsupported types', () => {
    const wrapper = mount(
      <SourceTypeField
        id="username"
        type="enum"
        title="User Name"
      />
    );

    expect(wrapper.find("input[id='username']")).toHaveLength(0);
    expect(wrapper.text()).toContain('Unsupported Type');
  });
});
