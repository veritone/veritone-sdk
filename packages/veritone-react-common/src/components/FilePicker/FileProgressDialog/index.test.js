import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import FileProgressDialog from './';

describe('FileProgressDialog', function() {

  it('shows the progressMessage', function() {
    const wrapper = mount(
      <FileProgressDialog
        progressMessage="test-progress"
        onRetryDone={noop}
        completeStatus={'failure'}
        retryRequest={noop}
        onClose={noop} />
    );

    expect(wrapper.text().match(/test-progress/)).toBeTruthy();
  });

  it('shows the failure icon with props.completeStatus == "failure"', function() {
    const wrapper = mount(
      <FileProgressDialog
        completeStatus="failure"
        onRetryDone={noop}
        retryRequest={noop}
        onClose={noop} />
    );

    expect(wrapper.find('[data-testtarget="successIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="warnIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="failureIcon"]').length).toBeTruthy();
  });

  it('shows the failure icon with props.completeStatus == "warning"', function() {
    const wrapper = mount(
      <FileProgressDialog
        completeStatus="warning"
        onRetryDone={noop}
        retryRequest={noop}
        onClose={noop} />
    );

    expect(wrapper.find('[data-testtarget="successIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="failureIcon"]')).toHaveLength(0);
    expect(wrapper.find('[data-testtarget="warnIcon"]').length).toBeTruthy();
  });
});
