import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import BreadcrumbItem from './BreadcrumItem';
import Breadcrumbs from './';

describe('Breadcrumbs', () => {
  it('Should have Root Crumb Text when empty', () => {
    const wrapper = mount(<Breadcrumbs pathList={[]} onCrumbClick={noop} />);
    expect(wrapper.contains('My Files')).toBe(true);
  });
  it('Should have 4 crumbs + root', () => {
    const pathList = [
      { id: 'first', name: 'Parent' },
      { id: 'second', name: 'Child' },
      { id: 'third', name: 'GrandChild' },
      { id: 'fourth', name: 'Super GrandChild' },
    ];
    const wrapper = mount(<Breadcrumbs pathList={pathList} onCrumbClick={noop} />);
    expect(wrapper.find(BreadcrumbItem).length).toEqual(5);
  });

  it('Should have crumbs within hidden list', () => {
    const pathList = [
      { id: 'first', name: 'Parent' },
      { id: 'second', name: 'Child' },
      { id: 'third', name: 'GrandChild' },
      { id: 'fourth', name: 'Super GrandChild' },
      { id: 'fifth', name: 'Ultra GrandChild' }
    ];
    const wrapper = mount(<Breadcrumbs pathList={pathList} onCrumbClick={noop} />);
    expect(wrapper.find(BreadcrumbItem).length).toEqual(6);
  });
});