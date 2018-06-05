import React from 'react';
import { createMount } from '@material-ui/core/test-utils';
import CircularProgress from '@material-ui/core/CircularProgress';

import DelayedProgress from './';

let mount;
beforeAll(() => {
  mount = createMount();
});

describe('DelayedProgress', function() {
  it('exists', function() {
    const wrapper = mount(<DelayedProgress />);
    expect(wrapper).toHaveLength(1);
  });

  it('has a CircularProgress element if props.loading is true', function() {
    const wrapper = mount(<DelayedProgress />);
    expect(wrapper.find(CircularProgress)).toHaveLength(0);

    wrapper.setProps({ loading: true });
    expect(wrapper.find(CircularProgress)).toHaveLength(1);
  });

  it('passes props.circularProgressProps to the CircularProgress component', function() {
    const wrapper = mount(
      <DelayedProgress loading circularProgressProps={{ size: 120 }} />
    );
    expect(wrapper.find(CircularProgress).prop('size')).toBe(120);
  });
});
