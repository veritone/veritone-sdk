import React from 'react';
import { mount } from 'enzyme';

import ProgressDialog from './';

describe('ProgressDialog', function() {
  it('shows the percentComplete when not done', function() {
    const wrapper = mount(
      <ProgressDialog
        percentComplete={50}
        doneSuccess={false}
        doneFailure={false}
      />
    );

    expect(wrapper.text()).toBe('50%');
  });

  it('shows the progressMessage', function() {
    const wrapper = mount(
      <ProgressDialog percentComplete={50} progressMessage="test-progress" />
    );

    expect(wrapper.text().match(/test-progress/)).toBeTruthy();
  });

  it('shows the success icon with props.doneSuccess', function() {
    const wrapper = mount(<ProgressDialog doneSuccess />);

    expect(wrapper.find('[data-testtarget="failureIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="successIcon"]').length).toBeTruthy();
  });

  it('shows the failure icon with props.doneFailure', function() {
    const wrapper = mount(<ProgressDialog doneFailure />);

    expect(wrapper.find('[data-testtarget="successIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="failureIcon"]').length).toBeTruthy();
  });
});
