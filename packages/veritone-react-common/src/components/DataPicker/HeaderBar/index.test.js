import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import HeaderBar from './';
import Breadcrumbs from '../Breadcrumbs';

describe('Header Bar', () => {
  it('Should have breadcrumbs and media info toggle', () => {
    const wrapper = mount(
      <HeaderBar
        pathList={[]}
        onCrumbClick={noop}
        currentPickerType="folder" />
    );
    expect(wrapper.contains(Breadcrumbs)).toBe(true);
    expect(wrapper.find('#media-info-toggle').length).toBe(1);
  });
  it('Should hide media info toggle in upload mode', () => {
    const wrapper = mount(
      <HeaderBar
        pathList={[]}
        onCrumbClick={noop}
        currentPickerType="upload" />
    );
    expect(wrapper.contains(Breadcrumbs)).toBe(true);
    expect(wrapper.find('#media-info-toggle').length).toBe(0);
  });
});