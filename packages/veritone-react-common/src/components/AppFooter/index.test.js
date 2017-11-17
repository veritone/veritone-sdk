import React from 'react';
import { mount } from 'enzyme';

import AppFooter, { appFooterHeightShort, appFooterHeightTall } from './';

describe('AppFooter', () => {
  it('Should be a footer tag', () => {
    const wrapper = mount(<AppFooter />);
    expect(wrapper.find('footer')).toHaveLength(1);
  });

  it('Renders its children', function() {
    const wrapper = mount(
      <AppFooter>
        <span>a</span>
        <a>b</a>
        <div>c</div>
      </AppFooter>
    );
    expect(wrapper.find('footer').children()).toHaveLength(3);
    expect(wrapper.text()).toMatch(/.*a.*b.*c/);
  });

  it('changes elevation with props.elevation', function() {
    const wrapper = mount(<AppFooter elevation={15} />);
    expect(wrapper.props().elevation).toBe(15);
  });

  it('adds left offset with props.leftOffset', function() {
    const wrapper = mount(<AppFooter leftOffset={100} />);
    expect(wrapper.children().props().style.marginLeft).toBe(100);
  });

  it('exports and uses appFooterHeightShort/Tall with props.height', function() {
    // default short
    let wrapper = mount(<AppFooter />);
    expect(wrapper.children().props().style.height).toBe(appFooterHeightShort);

    wrapper = mount(<AppFooter height="short" />);
    expect(wrapper.children().props().style.height).toBe(appFooterHeightShort);

    wrapper = mount(<AppFooter height="tall" />);
    expect(wrapper.children().props().style.height).toBe(appFooterHeightTall);
  });
});
