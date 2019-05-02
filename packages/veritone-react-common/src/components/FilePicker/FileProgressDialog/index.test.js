import React from 'react';
import { mount } from 'enzyme';

import FileProgressDialog from './';

describe('FileProgressDialog', function() {
  // it('shows the percentComplete when not done', function() {
  //   const wrapper = mount(<FileProgressDialog percentComplete={50} />);

  //   expect(wrapper.text()).toBe('50%');
  // });

  it('shows the progressMessage', function() {
    const wrapper = mount(
      <FileProgressDialog percentComplete={50} progressMessage="test-progress" />
    );

    expect(wrapper.text().match(/test-progress/)).toBeTruthy();
  });

  it('shows the success icon with props.completeStatus == "success"', function() {
    const wrapper = mount(<FileProgressDialog completeStatus="success" />);

    expect(wrapper.find('[data-testtarget="failureIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="warnIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="successIcon"]').length).toBeTruthy();
  });

  it('shows the failure icon with props.completeStatus == "failure"', function() {
    const wrapper = mount(<FileProgressDialog completeStatus="failure" />);

    expect(wrapper.find('[data-testtarget="successIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="warnIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="failureIcon"]').length).toBeTruthy();
  });

  it('shows the failure icon with props.completeStatus == "warning"', function() {
    const wrapper = mount(<FileProgressDialog completeStatus="warning" />);

    expect(wrapper.find('[data-testtarget="successIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="failureIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="warnIcon"]').length).toBeTruthy();
  });
});
